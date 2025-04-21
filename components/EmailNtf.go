package controllers

import (
    "bytes"
    "encoding/json"
    "io"
    "log"
    "net/http"
    "os"
    "time"
)

// Struct for the inner payload
type EmailRequest struct {
    MailFrom string `json:"mail_from"`
    MailTo   string `json:"mail_to"`
    Subject  string `json:"sbjct"`
    Body     string `json:"bdy"`
}

// Struct for the full payload
type EmailRequestWrapper struct {
    EtlStpParms EmailRequest `json:"etl_stp_parms"`
}

// SendEmailHandler handles sending the email
func (c Controller) SendEmailHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        
        // 1. Ensure method is POST
        if r.Method != http.MethodPost {
            http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
            return
        }

        // 2. Extract 'env' from query parameter (optional)
        env := r.URL.Query().Get("env")
        if env == "" {
            http.Error(w, "Missing 'env' query parameter", http.StatusBadRequest)
            return
        }
        log.Println("Environment value in SendEmailHandler set to:", env)

        // 3. Decode incoming request payload into EmailRequest struct
        var emailReq EmailRequest
        err := json.NewDecoder(r.Body).Decode(&emailReq)
        if err != nil {
            http.Error(w, "Invalid request payload", http.StatusBadRequest)
            log.Println("Error decoding request payload:", err)
            return
        }

        log.Printf("Received payload from frontend: %+v\n", emailReq)

        // 4. Wrap it under etl_stp_parms
        emailReqWrapper := EmailRequestWrapper{
            EtlStpParms: emailReq,
        }

        // 5. Marshal wrapped payload into JSON
        payload, err := json.Marshal(emailReqWrapper)
        if err != nil {
            http.Error(w, "Failed to marshal request payload", http.StatusInternalServerError)
            log.Println("Error marshaling request payload:", err)
            return
        }

        log.Printf("FINAL payload being sent to Lambda: %s\n", string(payload))

        // 6. Define your API Gateway endpoint
        apiEndpoint := "https://your-api-gateway-id.execute-api.us-east-2.amazonaws.com/dev/email" // Replace with your real URL
        log.Println("Sending request to API endpoint:", apiEndpoint)

        // 7. Create the HTTP request
        req, err := http.NewRequest(http.MethodPost, apiEndpoint, bytes.NewBuffer(payload))
        if err != nil {
            http.Error(w, "Failed to create HTTP request", http.StatusInternalServerError)
            log.Println("Error creating HTTP request:", err)
            return
        }

        // 8. Set headers
        req.Header.Set("Content-Type", "application/json")

        // 9. If API key is required, add it
        apiKey := os.Getenv("API_KEY")
        if apiKey != "" {
            req.Header.Set("x-api-key", apiKey)
        }

        // 10. Create HTTP client and send the request
        client := &http.Client{Timeout: 10 * time.Second}
        resp, err := client.Do(req)
        if err != nil {
            http.Error(w, "Failed to send email", http.StatusInternalServerError)
            log.Println("Error sending HTTP request:", err)
            return
        }
        defer resp.Body.Close()

        // 11. Read and log the response
        body, _ := io.ReadAll(resp.Body)
        log.Printf("Response status: %d, body: %s\n", resp.StatusCode, string(body))

        // 12. Handle non-200 responses
        if resp.StatusCode != http.StatusOK {
            http.Error(w, "Failed to send email", http.StatusInternalServerError)
            return
        }

        // 13. Respond with success
        log.Println("Email sent successfully via API")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"message": "Email sent successfully via API"}`))
    }
}
