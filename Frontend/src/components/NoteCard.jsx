import styled from 'styled-components';

function NoteCard({ text }) {
  return (
    <StyledWrapper>
      <div className="page">
        <div className="margin" />
        <p>{text}</p>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .page {
    position: relative;
    box-sizing: border-box;
    max-width: 100%;
    height: 220px;
    font-family: cursive;
    font-size: 20px;
    border-radius: 10px;
    background: #fff;
    background-image: linear-gradient(#f5f5f0 1.1rem, #ccc 1.2rem);
    background-size: 100% 1.2rem;
    line-height: 1.2rem;
    padding: 1.4rem 0.5rem 0.3rem 4.5rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .page:hover {
    box-shadow: rgba(0,0,0,0.5) 0px 3px 20px;
  }

  .page::before,
  .page::after {
    position: absolute;
    content: '';
    bottom: 10px;
    width: 40%;
    height: 10px;
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.7);
    z-index: -1;
    transition: all 0.3s ease;
  }

  .page::before {
    left: 15px;
    transform: skew(-5deg) rotate(-5deg);
  }

  .page::after {
    right: 15px;
    transform: skew(5deg) rotate(5deg);
  }

  .page:hover::before,
  .page:hover::after {
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.4);
  }

  .margin {
    position: absolute;
    border-left: 1px solid #d88;
    height: 100%;
    left: 3.3rem;
    top: 0;
  }

  .page p {
    margin: 0;
    text-indent: 1rem;
    padding-bottom: 1.2rem;
    color: black;
    line-height: 20px;
  }
`;

export default NoteCard;
