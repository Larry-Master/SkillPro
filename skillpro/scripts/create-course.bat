echo Create a Course
curl -X POST http://localhost:3000/api/courses -H "Content-Type: application/json" -d "{\"_id\":\"64f1b8c8a6e8f94b5a5a1a02\",\"title\":\"Intro to Next.js\",\"description\":\"Learn Next.js\",\"professor\":\"64f1b8c8a6e8f94b5a5a1a01\",\"capacity\":30}"
pause
