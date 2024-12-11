package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
)

const (
    secretPhrase = "governance_portal"
)

type Controller struct{}

func isAuthenticated(r *http.Request) bool {
    authHeader := r.Header.Get("Authorization")
    if authHeader == "" {
        return false
    }
    return authHeader == secretPhrase
}

func (c Controller) batchInsertHandler(w http.ResponseWriter, r *http.Request, isPublic bool, insertFunc func(db interface{}, records [][]string, userID string) (interface{}, error)) {
    if isPublic && !isAuthenticated(r) {
        error := models.Error{Message: "Unauthorized"}
        utils.SendError(w, http.StatusUnauthorized, error)
        return
    }

    var error models.Error
    trimmedRecords := utils.ParseCSV(r)
    env := r.URL.Query().Get("env")
    lastUpdatedUserID := r.URL.Query().Get("lastupdateduserid")

    db := driver.GetDB(models.DBType{
        Env:             env,
        PermissionLevel: utils.Write,
    })

    qry := queries.ProcessingQuery{}
    statusResponse, err := insertFunc(db, trimmedRecords, lastUpdatedUserID)
    if err != nil {
        error.Message = err.Error()
        utils.SendError(w, http.StatusInternalServerError, error)
        return
    }

    fmt.Printf("Endpoint Hit: Batch Insert %s\n", getEndpointName(r.URL.Path))
    json.NewEncoder(w).Encode(statusResponse)
}

func getEndpointName(path string) string {
    parts := strings.Split(path, "/")
    return parts[len(parts)-1]
}

func (c Controller) BatchInsertCnfgFromCSV() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertCnfgFromCSV)
    }
}

func (c Controller) BatchInsertCnfgFromCSVPublic() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertCnfgFromCSV)
    }
}

func (c Controller) BatchInsertETLFromCSV() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertETLFromCSV)
    }
}

func (c Controller) BatchInsertETLFromCSVPublic() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertETLFromCSV)
    }
}

func (c Controller) BatchInsertVulcanFromCSV() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertVulcanFromCSV)
    }
}

func (c Controller) BatchInsertVulcanFromCSVPublic() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertVulcanFromCSV)
    }
}

func (c Controller) BatchInsertFalconFromCSV() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertFalconFromCSV)
    }
}

func (c Controller) BatchInsertFalconFromCSVPublic() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertFalconFromCSV)
    }
}




// package main

// import (
//     "encoding/json"
//     "fmt"
//     "net/http"
//     "strings"
//     "database/sql"
// )

// const (
//     secretPhrase = "governance_portal"
// )

// type Controller struct{}

// func isAuthenticated(r *http.Request) bool {
//     authHeader := r.Header.Get("Authorization")
//     if authHeader == "" {
//         return false
//     }
//     return authHeader == secretPhrase
// }

// func (c Controller) batchInsertHandler(w http.ResponseWriter, r *http.Request, isPublic bool, 
//     insertFunc func(db *sql.DB, records [][]string) (interface{}, error)) {
    
//     if isPublic && !isAuthenticated(r) {
//         error := models.Error{Message: "Unauthorized"}
//         utils.SendError(w, http.StatusUnauthorized, error)
//         return
//     }

//     var error models.Error
//     trimmedRecords := utils.ParseCSV(r)
//     env := r.URL.Query().Get("env")
//     lastUpdatedUserID := r.URL.Query().Get("lastupdateduserid")

//     db := driver.GetDB(models.DBType{
//         Env:             env,
//         PermissionLevel: utils.Write,
//     })

//     qry := queries.ProcessingQuery{}
//     statusResponse, err := insertFunc(db, trimmedRecords)
//     if err != nil {
//         error.Message = err.Error()
//         utils.SendError(w, http.StatusInternalServerError, error)
//         return
//     }

//     fmt.Printf("Endpoint Hit: Batch Insert %s\n", getEndpointName(r.URL.Path))
//     json.NewEncoder(w).Encode(statusResponse)
// }

// func getEndpointName(path string) string {
//     parts := strings.Split(path, "/")
//     return parts[len(parts)-1]
// }

// func (c Controller) BatchInsertCnfgFromCSV() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertCnfgFromCSV)
//     }
// }

// func (c Controller) BatchInsertCnfgFromCSVPublic() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertCnfgFromCSV)
//     }
// }

// func (c Controller) BatchInsertETLFromCSV() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertETLFromCSV)
//     }
// }

// func (c Controller) BatchInsertETLFromCSVPublic() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertETLFromCSV)
//     }
// }

// func (c Controller) BatchInsertVulcanFromCSV() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertVulcanFromCSV)
//     }
// }

// func (c Controller) BatchInsertVulcanFromCSVPublic() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertVulcanFromCSV)
//     }
// }

// func (c Controller) BatchInsertFalconFromCSV() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, false, queries.ProcessingQuery{}.BatchInsertFalconFromCSV)
//     }
// }

// func (c Controller) BatchInsertFalconFromCSVPublic() http.HandlerFunc {
//     return func(w http.ResponseWriter, r *http.Request) {
//         c.batchInsertHandler(w, r, true, queries.ProcessingQuery{}.BatchInsertFalconFromCSV)
//     }
// }








