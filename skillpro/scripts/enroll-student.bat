echo Enroll a Student in a Course
curl -X POST http://localhost:3000/api/enroll -H "Content-Type: application/json" -d "{\"studentId\":\"64f1b8c8a6e8f94b5a5a1a02\",\"courseId\":\"64f1b8c8a6e8f94b5a5a1a03\"}"
pause
