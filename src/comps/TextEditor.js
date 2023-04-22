import React, { useState, useEffect, useRef } from 'react';
import { filterInput } from 'utils/helpers';

const TextEditor = ({ content, onContentChange }) => {
  const editorRef = useRef(null);
  const prevContentRef = useRef('Escribe aquí tus análisis y predicciones...');

 const  handleButtonClick = (event) => {
    event.preventDefault();
    const command = event.target.dataset.command;
    if (command === 'insertImage') {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            console.log(e.target.files);
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                document.execCommand('insertImage', false, reader.result);
            };
            reader.readAsDataURL(file);
        };
        fileInput.click();
    } else if (command === 'h1' || command === 'h2' || command === 'p') {
        if (editorRef.innerHTML === '') {
          document.execCommand('formatBlock', false, 'p');
        } else {
          document.execCommand('formatBlock', false, command);
        }
      } else if (command === 'removeFormat') {
        document.execCommand('removeFormat', false, command);
    } else if (command === 'createLink') {
        const url = prompt('Enter the link here: ', 'https:\/\/');
        if (url) {
            document.execCommand(command, false, url);
        }
    } else if (command === 'clean') {
        document.execCommand('delete', false, command);
    } else if (command === 'cut') {
        document.execCommand('cut', false, command);
    }else if (command === 'italic') {
        document.execCommand('italic', false, command);
    }else if (command === 'bold') {
        document.execCommand('bold', false, command);
    } else if (command === 'undo') {
        document.execCommand('undo', false, command);
    } else if (command === 'redo') {
        document.execCommand('redo', false, command);
    } else if (command === 'selectAll') {
        document.execCommand('selectAll', false, command);
    } else if (command === 'justifyCenter') {
        document.execCommand('justifyCenter', false, command);
    } else if (command === 'justifyLeft') {
        document.execCommand('justifyLeft', false, command);
    } else if (command === 'justifyRight') {
        document.execCommand('justifyRight', false, command);
    }
}

  const handleImageClick = (e) => {
    document.execCommand('enableObjectResizing', false);
    console.log(e.target);
  };

  const handleInput = (e) => {
    const html = e.target.innerHTML;
    if (html.length > 10) {
      onContentChange(html);
    }
  };

  const handleBlur = (e) => {
    const html = e.target.innerHTML;
    //onContentChange(html);
  };

  useEffect(() => {
    const sanitizedContent = filterInput(content, 'html', {identifier: 'Post'});
    if (sanitizedContent !== prevContentRef.current) {
      prevContentRef.current = sanitizedContent;
      onContentChange(sanitizedContent);
      console.log(sanitizedContent)
    }
  }, [content, onContentChange]);

  return (
    <>
      <div id="editorContainer">
        <div className="toolbar">
          <button className="btn fa fa-bold" data-command="bold" onClick={handleButtonClick}>bold</button>
          <button className="btn fa fa-italic" data-command="italic" onClick={handleButtonClick}>italic</button>
          <button className="btn fa fa-header" data-command="h1" onClick={handleButtonClick}>h1</button>
          <button className="btn fa fa-header" data-command="h2" onClick={handleButtonClick}>h2</button>
          <button className="btn fa fa-paragraph" data-command="p" onClick={handleButtonClick}>p</button>
          <button className="btn fa fa-image" data-command="insertImage" onClick={handleButtonClick}>insert image</button>
          <button className="btn fa fa-cut" data-command="cut" onClick={handleButtonClick}>cut</button>
          <button className="btn fa fa-undo" data-command="undo" onClick={handleButtonClick}>undo</button>
          <button className="btn fa fa-repeat" data-command="redo" onClick={handleButtonClick}>redo</button>
          <button className="btn fa fa-align-center" data-command="justifyCenter" onClick={handleButtonClick}>center</button>
          <button className="btn fa fa-align-left" data-command="justifyLeft" onClick={handleButtonClick}>left</button>
          <button className="btn fa fa-align-right" data-command="justifyRight" onClick={handleButtonClick}>right</button>
        </div>
        <div
          id="editor"
          ref={editorRef}
          className="editorAria"
          onClick={handleImageClick}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={handleInput}
          onBlur={handleBlur}
        ></div>
      </div>
    </>
  );
};

export default TextEditor;