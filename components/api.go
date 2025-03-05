func (c Controller) FetchApplicationProjectProfile() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Fetching Application Project Profile from JSON data")

		// Retrieve the 'env' query parameter
		env := r.URL.Query().Get("env")
		if env == "" {
			http.Error(w, "Missing 'env' query parameter", http.StatusBadRequest)
			return
		}
		log.Println("Environment set to:", env)

		// Get a database connection with read permissions
		db := driver.GetDB(models.DBType{
			Env:             env,
			PermissionLevel: utils.Read,
		})

		// Query to fetch the aplctn_dtls JSON column
		query := "SELECT aplctn_dtls FROM edl_application_intake_dtls"
		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
			log.Println("Query error:", err)
			return
		}
		defer rows.Close()

		// Slice to store the "Application Project Profile" sections from each row
		var profiles []map[string]interface{}

		// Iterate over each row returned by the query
		for rows.Next() {
			var jsonData []byte
			if err := rows.Scan(&jsonData); err != nil {
				http.Error(w, "Error scanning data", http.StatusInternalServerError)
				log.Println("Scan error:", err)
				return
			}

			// Unmarshal the JSON into a map
			var fullData map[string]interface{}
			if err := json.Unmarshal(jsonData, &fullData); err != nil {
				http.Error(w, "Error decoding JSON data", http.StatusInternalServerError)
				log.Println("JSON unmarshal error:", err)
				return
			}

			// Extract the "Application Project Profile" section, if present
			if appProfile, ok := fullData["Application Project Profile"]; ok {
				// Assert that it is a JSON object and append it
				if profileMap, ok := appProfile.(map[string]interface{}); ok {
					profiles = append(profiles, profileMap)
				} else {
					// If the profile is not a map, wrap it in a map with a generic key
					profiles = append(profiles, map[string]interface{}{"value": appProfile})
				}
			}
		}

		// Check for any error encountered during iteration
		if err = rows.Err(); err != nil {
			http.Error(w, "Error reading rows", http.StatusInternalServerError)
			log.Println("Rows error:", err)
			return
		}

		// Marshal the profiles slice to JSON and send the response
		response, err := json.Marshal(profiles)
		if err != nil {
			http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
			log.Println("JSON marshal error:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}
