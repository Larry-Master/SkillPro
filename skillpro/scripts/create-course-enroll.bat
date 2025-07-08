@echo off

REM Create a new course
curl -X POST http://localhost:3000/api/courses -H "Content-Type: application/json" -d "{\"_id\":\"64f1b8c8a6e8f94b5a5a1a10\",\"title\":\"New Course\",\"description\":\"Batch created course\",\"professor\":\"64f1b8c8a6e8f94b5a5a1a01\",\"capacity\":30}"
echo.
echo Created course with ID 64f1b8c8a6e8f94b5a5a1a10
echo.

REM Enroll a student in the course
curl -X POST http://localhost:3000/api/enroll -H "Content-Type: application/json" -d "{\"studentId\":\"64f1b8c8a6e8f94b5a5a1a02\",\"courseId\":\"64f1b8c8a6e8f94b5a5a1a10\"}"
echo.
echo Enrollment request sent for student 64f1b8c8a6e8f94b5a5a1a02 in course 64f1b8c8a6e8f94b5a5a1a10
pause
