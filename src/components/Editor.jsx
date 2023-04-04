import React, { useState, useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { dracula } from '@uiw/codemirror-theme-dracula';

import actions from "../actions";

// let language = new Compartment, tabSize = new Compartment

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const last_code = useRef("");

  useEffect(() => {
    const state = EditorState.create({
      doc: "",
      extensions: [
        basicSetup,
        javascript({
          jsx: true,
          typescript: true,
        }),
        EditorView.updateListener.of((e) => {
          const code = e.state.doc.toString();
          onCodeChange(code);
          if (code === last_code.current) {
            return;
          }
          // console.log("sent: ", code);
          last_code.current = code;
          socketRef.current.emit(actions.CODE_CHANGE, {
            roomId,
            code,
          });
        }),
        // tabSize.of(EditorState.tabSize.of(4)),
        keymap.of([indentWithTab]),
        dracula,
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    socketRef.current.on(actions.CODE_CHANGE, ({ code }) => {
      // console.log("received: ", code);
      if (code === last_code.current) {
        return;
      }
      last_code.current = code;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.viewState.state.doc.length,
          insert: code,
        },
      });
    });
    return () => {
      socketRef.current.off(actions.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <div id="editor" ref={editorRef}></div>;
};

export default Editor;
