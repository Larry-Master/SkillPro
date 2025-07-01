echo Update a Course
curl -X PUT "http://localhost:3000/api/courses/64f1b8c8a6e8f94b5a5a1a03" -H "Content-Type: application/json" -d "{\"title\":\"Updated Course Title\",\"capacity\":40}"
pause
