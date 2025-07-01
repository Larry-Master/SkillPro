echo Update a Student Profile
curl -X PUT "http://localhost:3000/api/students/64f1b8c8a6e8f94b5a5a1a02" -H "Content-Type: application/json" -d "{\"name\":\"Updated Student Name\",\"email\":\"updated@example.com\"}"
pause
