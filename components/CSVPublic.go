const (
	secretphrase = "governance_portal"
)

func (c Controller) BatchInsertTokenizationFromCSVPublic() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Authenticate the request
		if !isAuthenticated(r) {
			error := models.Error{Message: "Unauthorized"}
			utils.SendError(w, http.StatusUnauthorized, error)
			return
		}

		// Validate Content-Type
		contentType := r.Header.Get("Content-Type")
		if contentType == "" || !strings.HasPrefix(contentType, "multipart/form-data") {
			error := models.Error{Message: "Request Content-Type must be multipart/form-data"}
			utils.SendError(w, http.StatusBadRequest, error)
			return
		}

		// Parse the multipart form
		err := r.ParseMultipartForm(10 << 20) // 10 MB limit
		if err != nil {
			error := models.Error{Message: "Failed to parse multipart form: " + err.Error()}
			utils.SendError(w, http.StatusBadRequest, error)
			return
		}

		// Retrieve the file from the form
		file, _, err := r.FormFile("file") // "file" must match the form field name
		if err != nil {
			error := models.Error{Message: "Unable to retrieve file from form data: " + err.Error()}
			utils.SendError(w, http.StatusBadRequest, error)
			return
		}
		defer file.Close()

		// Parse the CSV file
		trimmedRecords, err := utils.ParseCSVFile(file)
		if err != nil || len(trimmedRecords) == 0 {
			error := models.Error{Message: "Failed to parse CSV or CSV is empty: " + err.Error()}
			utils.SendError(w, http.StatusBadRequest, error)
			return
		}

		// Validate query parameters
		envValues := r.URL.Query()["env"]
		teamUserValues := r.URL.Query()["teamuser"]
		uploadTypeValues := r.URL.Query()["upload_type"]

		// Check if parameters exist and retrieve their first value
		if len(envValues) == 0 || len(teamUserValues) == 0 || len(uploadTypeValues) == 0 {
			error := models.Error{Message: "Missing required query parameters: env, teamuser, or upload_type"}
			utils.SendError(w, http.StatusBadRequest, error)
			return
		}

		env := envValues[0]
		teamUser := teamUserValues[0]
		uploadType := uploadTypeValues[0]

		// Initialize database connection
		db := driver.GetDB(models.DBType{
			Env:             env,
			PermissionLevel: utils.Write,
		})
		if db == nil {
			error := models.Error{Message: "Failed to initialize the database"}
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		// Execute batch insert query
		qry := queries.ProcessingQuery{}
		statusResponse, err := qry.BatchInsertTokenizationFromCSV(db, trimmedRecords, uploadType, teamUser, env)
		if err != nil {
			error := models.Error{Message: err.Error()}
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		// Success response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(statusResponse)
	}
}

func isAuthenticated(r *http.Request) bool {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return false
	}

	// Extract token (e.g., if "Bearer <token>" format is used)
	token := strings.TrimSpace(strings.Replace(authHeader, "Bearer", "", 1))
	return token == secretphrase
}

// ParseCSVFile reads and parses a CSV file from a multipart file upload.
func ParseCSVFile(file multipart.File) ([][]string, error) {
	csvReader := csv.NewReader(file)
	records, err := csvReader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to parse CSV file: %w", err)
	}
	return records, nil
}
