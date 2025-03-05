func (c Controller) FetchProjectIntakeDtls() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("FetchProjectIntakeDtls")
		
		// Keep the beginning part unchanged: extract the 'env' query parameter and get DB connection.
		env := r.URL.Query()["env"][0]
		log.Println("FetchProjectIntakeDtls set to:", env)
		db := driver.GetDB(models.DBType{
			Env:             env,
			PermissionLevel: utils.Write,
		})

		// Query to fetch the aplctn_dtls column containing JSON.
		query := "SELECT aplctn_dtls FROM edl_application_intake_dtls"
		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
			log.Println("Query error:", err)
			return
		}
		defer rows.Close()

		// Slice to store only the "Application Project Profile" sections.
		var profiles []interface{}

		// Iterate over each row.
		for rows.Next() {
			var jsonData []byte
			if err := rows.Scan(&jsonData); err != nil {
				http.Error(w, "Error scanning data", http.StatusInternalServerError)
				log.Println("Scan error:", err)
				return
			}

			// Unmarshal the JSON into a map.
			var record map[string]interface{}
			if err := json.Unmarshal(jsonData, &record); err != nil {
				http.Error(w, "Error decoding JSON data", http.StatusInternalServerError)
				log.Println("Unmarshal error:", err)
				return
			}

			// Extract the "Application Project Profile" section from the JSON.
			if appProfile, ok := record["Application Project Profile"]; ok {
				profiles = append(profiles, appProfile)
			} else {
				// If the key is not found, you can choose to append nil or skip this record.
				profiles = append(profiles, nil)
			}
		}

		// Check for any errors encountered during row iteration.
		if err := rows.Err(); err != nil {
			http.Error(w, "Error reading rows", http.StatusInternalServerError)
			log.Println("Rows error:", err)
			return
		}

		// Marshal the extracted profiles to JSON.
		response, err := json.Marshal(profiles)
		if err != nil {
			http.Error(w, "Error encoding response to JSON", http.StatusInternalServerError)
			log.Println("JSON marshal error:", err)
			return
		}

		// Set the content type and write the response.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}
