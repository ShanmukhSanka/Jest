package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

const (
    secretphrase = "governance_portal"
)

func (c Controller) BatchInsertTokenizationFromCSV() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.handleBatchInsertTokenization(w, r, false)
    }
}

func (c Controller) BatchInsertTokenizationFromCSVPublic() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if !isAuthenticated(r) {
            error := models.Error{Message: "Unauthorized"}
            utils.SendError(w, http.StatusUnauthorized, error)
            return
        }
        c.handleBatchInsertTokenization(w, r, true)
    }
}

func (c Controller) handleBatchInsertTokenization(w http.ResponseWriter, r *http.Request, isPublic bool) {
    var error models.Error

    // Parse CSV records
    trimmedRecords := utils.ParseCSV(r)

    // Extract query parameters
    env := r.URL.Query().Get("env")
    teamUser := r.URL.Query().Get("teamuser")
    uploadType := r.URL.Query().Get("upload_type")

    if env == "" || teamUser == "" || uploadType == "" {
        error.Message = "Missing required query parameters"
        utils.SendError(w, http.StatusBadRequest, error)
        return
    }

    // Get database connection
    db := driver.GetDB(models.DBType{
        Env:             env,
        PermissionLevel: utils.Write,
    })

    // Perform query
    qry := queries.ProcessingQueryt{}
    statusResponse, err := qry.BatchInsertTokenizationFromCSV(db, trimmedRecords, uploadType, teamUser, env)
    if err != nil {
        error.Message = err.Error()
        utils.SendError(w, http.StatusInternalServerError, error)
        return
    }

    // Log and send response
    if isPublic {
        fmt.Println("Endpoint Hit: Batch Insert Tokenization from CSV (Public)")
    } else {
        fmt.Println("Endpoint Hit: Batch Insert Tokenization from CSV")
    }

    json.NewEncoder(w).Encode(statusResponse)
}

func isAuthenticated(r *http.Request) bool {
    authHeader := r.Header.Get("Authorization")
    return authHeader == secretphrase
}






const (
    secretPhraseTokenization = "governance_portal"
    secretPhraseCSV          = "csv_portal_secret"
)

func (c Controller) handleBatchInsert(
    w http.ResponseWriter,
    r *http.Request,
    batchInsertFunc func(db driver.DB, records []string, uploadType, teamUser, env string) (interface{}, error),
    endpoint string,
) {
    var error models.Error

    // Parse CSV records
    trimmedRecords := utils.ParseCSV(r)

    // Extract query parameters
    env := r.URL.Query().Get("env")
    teamUser := r.URL.Query().Get("teamuser")
    uploadType := r.URL.Query().Get("upload_type")

    // Get database connection
    db := driver.GetDB(models.DBType{
        Env:             env,
        PermissionLevel: utils.Write,
    })

    // Execute the provided batch insert function
    statusResponse, err := batchInsertFunc(db, trimmedRecords, uploadType, teamUser, env)
    if err != nil {
        error.Message = err.Error()
        utils.SendError(w, http.StatusInternalServerError, error)
        return
    }

    // Log the endpoint hit and send response
    fmt.Printf("Endpoint Hit: %s\n", endpoint)
    json.NewEncoder(w).Encode(statusResponse)
}

// Public handler wrapper with secret phrase
func (c Controller) publicHandler(w http.ResponseWriter, r *http.Request, coreHandler http.HandlerFunc, secretPhrase string) {
    if !isAuthenticated(r, secretPhrase) {
        error := models.Error{Message: "Unauthorized"}
        utils.SendError(w, http.StatusUnauthorized, error)
        return
    }
    coreHandler(w, r)
}

func isAuthenticated(r *http.Request, secretPhrase string) bool {
    authHeader := r.Header.Get("Authorization")
    return authHeader == secretPhrase
}

func (c Controller) BatchInsertTokenizationFromCSV() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.handleBatchInsert(w, r, queries.ProcessingQueryt{}.BatchInsertTokenizationFromCSV, "Batch Insert Tokenization from CSV")
    }
}

func (c Controller) BatchInsertTokenizationFromCSVPublic() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.publicHandler(w, r, c.BatchInsertTokenizationFromCSV(), secretPhraseTokenization)
    }
}

func (c Controller) BatchInsertCSV() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.handleBatchInsert(w, r, queries.ProcessingQueryt{}.BatchInsertCSV, "Batch Insert CSV")
    }
}

func (c Controller) BatchInsertCSVPublic() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.publicHandler(w, r, c.BatchInsertCSV(), secretPhraseCSV)
    }
}
