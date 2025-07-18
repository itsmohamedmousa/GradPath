import styled from 'styled-components';

const EventCard = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <p className="time-text">
          <span>11:11</span>
          <span className="time-sub-text">PM</span>
        </p>
        <p className="day-text">Wednesday, June 15th</p>
        <div>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            strokeWidth={0}
            fill="currentColor"
            stroke="currentColor"
            className="moon"
          >
            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
          </svg> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            className="sun"
          >
            <path d="M8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM8 0a.5.5 0 0 1 .5.5v1.1a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 8 0zM8 13.4a.5.5 0 0 1 .5.5v1.1a.5.5 0 0 1-1 0v-1.1a.5.5 0 0 1 .5-.5zM2.342 2.343a.5.5 0 0 1 .707 0l.778.778a.5.5 0 1 1-.707.707l-.778-.778a.5.5 0 0 1 0-.707zM12.173 12.172a.5.5 0 0 1 .707 0l.778.778a.5.5 0 1 1-.707.707l-.778-.778a.5.5 0 0 1 0-.707zM0 8a.5.5 0 0 1 .5-.5h1.1a.5.5 0 0 1 0 1H.5A.5.5 0 0 1 0 8zM13.4 8a.5.5 0 0 1 .5-.5h1.1a.5.5 0 0 1 0 1h-1.1a.5.5 0 0 1-.5-.5zM2.342 13.657a.5.5 0 0 1 0-.707l.778-.778a.5.5 0 1 1 .707.707l-.778.778a.5.5 0 0 1-.707 0zM12.173 3.828a.5.5 0 0 1 0-.707l.778-.778a.5.5 0 1 1 .707.707l-.778.778a.5.5 0 0 1-.707 0z" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 280px;
    height: 220px;
    border-radius: 10px;
    display: flex;
    color: white;
    justify-content: center;
    position: relative;
    flex-direction: column;
    background: linear-gradient(to right, #2563eb, #bfdbfe);
    // background: linear-gradient(to right, rgb(20, 30, 48), rgba(57, 94, 136, 1));
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
  }

  .card:hover {
    box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 20px;
  }

  .time-text {
    font-size: 50px;
    margin-top: 0px;
    margin-left: 15px;
    font-weight: 600;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  .time-sub-text {
    font-size: 15px;
    margin-left: 5px;
  }

  .day-text {
    font-size: 18px;
    margin-top: 0px;
    margin-left: 15px;
    font-weight: 500;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  .moon {
    font-size: 20px;
    position: absolute;
    right: 15px;
    top: 15px;
    transition: all 0.3s ease-in-out;
  }

  .sun {
    font-size: 25px;
    position: absolute;
    right: 15px;
    top: 15px;
    color: yellow;
    transition: all 0.3s ease-in-out;
  }
`;

export default EventCard;
