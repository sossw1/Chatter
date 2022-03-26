export default function Rooms(props) {
  const { rooms } = props;

  return (
    <div className="centered-form">
      <div className="centered-form__box">
        <h1>Room Selection</h1>
        <div id="room-list">
          {rooms.map(({ roomName, roomId }) => {
            return (
              <div key={roomId}>
                <p>{roomName}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}