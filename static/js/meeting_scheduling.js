
const socket = io();
const meetingForm = document.getElementById('meetingForm');
const meetingDateTime = document.getElementById('meetingDateTime');
const meetingTitle = document.getElementById('meetingTitle');
const scheduledMeetings = document.getElementById('scheduledMeetings');

function scheduleMeeting(title, dateTime) {
    socket.emit('schedule-meeting', { title, dateTime });
}

socket.on('scheduled-meeting', (data) => {
    const { title, dateTime } = data;
    const meetingElement = document.createElement('div');
    meetingElement.classList.add('scheduled-meeting');
    meetingElement.innerHTML = `<strong>${title}</strong> - ${dateTime}`;
    scheduledMeetings.appendChild(meetingElement);
});

meetingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = meetingTitle.value;
    const dateTime = meetingDateTime.value;
    scheduleMeeting(title, dateTime);
    meetingTitle.value = '';
    meetingDateTime.value = '';
});
