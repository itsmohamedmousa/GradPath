import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useToastContext } from '../../contexts/ToastContext';

export default function ThemeModal({ open, onClose }) {
  // Initialize state from localStorage immediately
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const { show } = useToastContext();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    if (isDark) root.classList.add('dark');
    // Save to localStorage whenever theme changes
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (!open) return null;

  const handleToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-xl bg-[rgb(var(--card))] p-6 shadow-lg">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white text-center">
          Choose Theme
        </h2>

        <StyledWrapper>
          <div>
            <input id="switch" type="checkbox" checked={isDark} onChange={handleToggle} />
            <div className="app">
              <div className="body">
                <div className="phone">
                  <div className="content">
                    <div className="circle">
                      <div className="crescent" />
                    </div>
                    <label htmlFor="switch">
                      <div className="toggle" />
                      <div className="names">
                        <p className="light">Light</p>
                        <p className="dark">Dark</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StyledWrapper>

        <button
          onClick={() => {
            onClose();
            show('Theme changed to ' + (isDark ? 'Dark' : 'Light'), 'info');
          }}
          className="mt-6 w-full rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  /* Phone */
  .phone {
    position: relative;
    z-index: 2;
    width: 18rem;
    height: 14rem;
    background-color: #e8e8e8;
    transition: background-color 0.6s;
    box-shadow: 0 4px 35px rgba(0, 0, 0, 0.1);
    border-radius: 40px;
    display: flex;
    flex-direction: column;
  }

  /* Middle */
  .content {
    display: flex;
    flex-direction: column;
    margin: auto;
    text-align: center;
    width: 70%;
  }

  .circle {
    position: relative;
    border-radius: 100%;
    width: 8rem;
    height: 8rem;
    background: linear-gradient(40deg, #ff0080, #ff8c00, #e8e8e8, #8983f7, #a3dafb 80%);
    background-size: 400%;
    transition: background-position 0.6s;
    margin: auto;
  }

  .crescent {
    position: absolute;
    border-radius: 100%;
    right: 0;
    width: 6rem;
    height: 6rem;
    background: #e8e8e8;
    transform: scale(0);
    transform-origin: top right;
    transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0.6s;
  }

  label,
  .toggle {
    height: 2.8rem;
    border-radius: 100px;
  }

  label {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    position: relative;
    margin: 1.8rem 0 0 0;
    cursor: pointer;
  }

  .toggle {
    position: absolute;
    width: 50%;
    background-color: #fff;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .names {
    font-size: 90%;
    font-weight: bolder;
    color: black;
    width: 65%;
    margin-left: 17.5%;
    margin-top: 6.5%;
    position: absolute;
    display: flex;
    justify-content: space-between;
    user-select: none;
  }

  .dark {
    opacity: 0.5;
  }

  /* -------- Switch Styles ------------*/
  [type='checkbox'] {
    display: none;
  }

  /* Toggle */
  [type='checkbox']:checked + .app .toggle {
    transform: translateX(100%);
    background-color: #34323d;
  }

  [type='checkbox']:checked + .app .dark {
    opacity: 1;
    color: white;
  }

  [type='checkbox']:checked + .app .light {
    opacity: 1;
    color: white;
  }

  /* App */
  [type='checkbox']:checked + .app .phone {
    background-color: #26242e;
    color: white;
  }

  /* Circle */
  [type='checkbox']:checked + .app .crescent {
    transform: scale(1);
    background: #26242e;
  }

  [type='checkbox']:checked + .app .circle {
    background-position: 100% 100%;
  }
`;
