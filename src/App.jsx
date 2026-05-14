import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

const initialPadding = {
  1: { top: 0, right: 0, bottom: 0, left: 0 },
  2: { top: 0, right: 0, bottom: 0, left: 0 },
  3: { top: 0, right: 0, bottom: 0, left: 0 },
};

function App() {
  const [inputText, setInputText] = useState('');
  const [shayariText, setShayariText] = useState('Loading Shayari...');
  const [shayariList, setShayariList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [padding, setPadding] = useState(initialPadding);

  useEffect(() => {
    async function loadShayari() {
      try {
        const response = await fetch('/shayari.txt');
        const text = await response.text();
        const list = text
          .split('===')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        setShayariList(list);
        if (list.length > 0) {
          setShayariText(list[0]);
        }
      } catch (error) {
        console.error('TXT FILE LOAD ERROR:', error);
        setShayariText('shayari.txt file nahi mili.');
      }
    }

    loadShayari();
  }, []);

  const updatePost = () => {
    if (inputText.trim() !== '') {
      setShayariText(inputText);
    }
  };

  const randomShayari = () => {
    if (shayariList.length === 0) return;
    setShayariText(shayariList[currentIndex]);
    setCurrentIndex((currentIndex + 1) % shayariList.length);
  };

  const updatePadding = (postNumber, side, value) => {
    setPadding((prev) => ({
      ...prev,
      [postNumber]: {
        ...prev[postNumber],
        [side]: Number(value),
      },
    }));
  };

  const downloadPost = async (postNumber) => {
    const post = document.getElementById(`post-${postNumber}`);
    if (!post) return;

    const canvas = await html2canvas(post, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#000',
      removeContainer: true,
    });

    const link = document.createElement('a');
    link.download = `purane-panne-post-${postNumber}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const renderPaddingInputs = (postNumber, label) => (
    <div className="padding-group">
      <div className="padding-title">{label}</div>
      {['top', 'right', 'bottom', 'left'].map((side) => (
        <label key={side} className="padding-field">
          {side.charAt(0).toUpperCase() + side.slice(1)}
          <input
            type="number"
            value={padding[postNumber][side]}
            onChange={(event) => updatePadding(postNumber, side, event.target.value)}
          />
        </label>
      ))}
    </div>
  );

  return (
    <div className="app-container">
      <div className="post-wrapper">
        <div className="post post-1" id="post-1">
          <div className="shayari" style={padding[1]}>{shayariText}</div>
          <div className="watermark">@purane.panne8808</div>
        </div>
      </div>

      <div className="post-wrapper">
        <div className="post post-2" id="post-2">
          <div className="shayari" style={padding[2]}>{shayariText}</div>
          <div className="watermark">@purane.panne8808</div>
        </div>
      </div>

      <div className="post-wrapper">
        <div className="post post-3" id="post-3">
          <div className="shayari" style={padding[3]}>{shayariText}</div>
          <div className="watermark">@purane.panne8808</div>
        </div>
      </div>

      <textarea
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        placeholder="Apni shayari yaha likho..."
      />

      <div className="padding-controls">
        {renderPaddingInputs(1, 'Post 1 (Burgandy)')}
        {renderPaddingInputs(2, 'Post 2 (Black)')}
        {renderPaddingInputs(3, 'Post 3 (Book)')}
      </div>

      <div className="controls">
        <button onClick={updatePost}>UPDATE ALL POSTS</button>
        <button onClick={randomShayari}>RANDOM SHAYARI</button>
        <button onClick={() => downloadPost(1)}>DOWNLOAD POST 1</button>
        <button onClick={() => downloadPost(2)}>DOWNLOAD POST 2</button>
        <button onClick={() => downloadPost(3)}>DOWNLOAD POST 3</button>
      </div>
    </div>
  );
}

export default App;
