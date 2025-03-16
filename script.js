async function fetchResponse() {
    const userInput = document.getElementById('userInput').value;
    const responseArea = document.getElementById('responseArea');

    if (!userInput) {
        responseArea.innerHTML = '<p>Vui lòng nhập câu hỏi!</p>';
        return;
    }

    responseArea.innerHTML = '<p>Đang lấy phản hồi...</p>';

    try {
        const apiKey = 'AIzaSyBJNWOxAoMO1aNIUu7jAZ-yXNNupHi7AGA';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{ text: userInput }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error('Yêu cầu API thất bại');

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;

        // Chuyển Markdown thành HTML bằng marked
        responseArea.innerHTML = `<p><strong>Phản hồi:</strong></p> ${marked.parse(generatedText)}`;
    } catch (error) {
        responseArea.innerHTML = `<p><strong>Lỗi:</strong> ${error.message}</p>`;
    }
}