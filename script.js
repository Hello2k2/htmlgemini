let lastGeneratedText = ''; // Biến lưu văn bản gốc từ API

async function fetchResponse() {
    const userInput = document.getElementById('userInput').value;
    const responseArea = document.getElementById('responseArea');

    if (!userInput) {
        responseArea.innerHTML = '<p>Vui lòng nhập câu hỏi!</p>';
        return;
    }

    responseArea.innerHTML = '<p>Đang lấy phản hồi...</p>';

    try {
        const apiKey = 'AIzaSyBJNWOxAoMO1aNIUu7jAZ-yXNNupHi7AGA'; // **HÃY THAY THẾ BẰNG API KEY THỰC CỦA BẠN**
        const modelName = 'gemini-flash'; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{ text: userInput }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // Nếu phản hồi KHÔNG thành công, lấy mã trạng thái (ví dụ: 403, 404)
            const errorStatus = response.status; 
            
            // Đọc nội dung phản hồi (thường là JSON) để lấy thông báo chi tiết của Google
            const errorData = await response.json().catch(() => ({ message: 'Không thể đọc phản hồi lỗi.' }));
            const errorMessage = errorData.error ? errorData.error.message : 'Lỗi không xác định từ API.';

            // Ném ra một lỗi mới bao gồm Mã HTTP và thông báo chi tiết
            throw new Error(`HTTP ${errorStatus}: ${errorMessage}`);
        }
        // KẾT THÚC CHỈNH SỬA Ở ĐÂY

        const data = await response.json();
        lastGeneratedText = data.candidates[0].content.parts[0].text; // Lưu văn bản gốc
        responseArea.innerHTML = `<p><strong>Phản hồi:</strong></p> ${marked.parse(lastGeneratedText)}`;
    } catch (error) {
        responseArea.innerHTML = `<p><strong>Lỗi:</strong> ${error.message}</p>`;
        lastGeneratedText = ''; // Reset nếu lỗi
    }
}

function readResponse() {
    if (!('speechSynthesis' in window)) {
        alert('Trình duyệt của bạn không hỗ trợ đọc văn bản!');
        return;
    }

    if (!lastGeneratedText) {
        alert('Chưa có phản hồi để đọc!');
        return;
    }

    const sentences = lastGeneratedText.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s/); // Chia theo dấu câu

    let utterance;
    let index = 0;

    function speakNextSentence() {
        if (index < sentences.length) {
            utterance = new SpeechSynthesisUtterance(sentences[index]);
            utterance.lang = 'vi-VN';
            utterance.volume = 1;
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onend = speakNextSentence; // Gọi hàm này khi đọc xong
            window.speechSynthesis.speak(utterance);
            index++;
        }
    }

    window.speechSynthesis.cancel();
    speakNextSentence();
}
