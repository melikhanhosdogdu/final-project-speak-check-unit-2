import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mic, Square } from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import "./AddCommentModal.css";

import { storageAPI, commentAPI } from "../../shared/api/api";
import { fetchBackgroundImages } from "../../utils/fetch-backgrounds-images";

const commentSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  recording: z.any().nullable(),
});

function AddCommentModal({
  isOpen,
  onClose,
  postKeyword,
  postId,
  onCommentAdded,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingTimeRef = useRef(0);
  const userName = JSON.parse(localStorage.getItem("user") || "null")?.username;

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      keyword: "",
      recording: null,
    },
  });

  const keyword = watch("keyword");
  const recording = watch("recording");

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getSupportedMimeType = () => {
    const types = [
      "audio/webm",
      "audio/mp4",
      "audio/aac",
      "audio/ogg",
      "audio/wav",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "audio/webm";
  };

  const getFileExtension = (mimeType) => {
    if (!mimeType) return "webm";
    const map = {
      "audio/webm": "webm",
      "audio/mp4": "mp4",
      "audio/aac": "aac",
      "audio/ogg": "ogg",
      "audio/wav": "wav",
    };
    return map[mimeType] || "webm";
  };

  const getMimeType = (mimeType) => {
    if (!mimeType) return "audio/webm";
    if (mimeType.includes("webm")) return "audio/webm";
    if (mimeType.includes("mp4")) return "audio/mp4";
    if (mimeType.includes("aac")) return "audio/aac";
    if (mimeType.includes("ogg")) return "audio/ogg";
    if (mimeType.includes("wav")) return "audio/wav";
    return "audio/webm"; // default
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const mimeType = getSupportedMimeType();
      const options = MediaRecorder.isTypeSupported(mimeType)
        ? { mimeType }
        : {};

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];
      recordingTimeRef.current = 0;
      setRecordingTime(0);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const mimeType = getMimeType(
          mediaRecorderRef.current?.mimeType || "audio/webm",
        );
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setValue("recording", {
          url,
          blob,
          type: mimeType,
          extension: getFileExtension(mimeType),
          duration: recordingTimeRef.current,
          timestamp: new Date().toLocaleString(),
        });
        setRecordingTime(0);
        recordingTimeRef.current = 0;
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        recordingTimeRef.current += 10;
        setRecordingTime((prev) => prev + 10);
      }, 10);
    } catch (error) {
      alert("Microphone access denied: " + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setValue("recording", null);
  };
  const generateUploadURL = async (recording) => {
    try {
      const response = await storageAPI.generateUploadUrl({
        ext: recording.extension,
        contentType: recording.type,
      });

      return response.data;
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw new Error("Failed to generate upload URL");
    }
  };

  const onSubmit = async (data) => {
    let payload = {};
    if (data.recording) {
      const uploadData = await generateUploadURL(data.recording);

      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": data.recording.type,
        },
        body: data.recording.blob,
      });

      if (uploadResponse.ok) {
      }
      payload["audioKey"] = uploadData.key;
    }

    const backgroundImageUrl = await fetchBackgroundImages();

    payload = {
      text: data.keyword,
      backgroundImageUrl: backgroundImageUrl,
      audioKey: null,
    };

    const createdComment = (
      await commentAPI.createCommentsForPost(postId, payload)
    ).data;

    const newComment = {
      id: createdComment.id,
      userName: userName,
      text: data.keyword,
      audioURL: createdComment.audioURL,
      commentCount: -1,
      likeCount: createdComment.likeCount,
      isLikedByCurrentUser: createdComment.likedByCurrentUser,
    };

    onCommentAdded(postId, newComment);
    reset();
    onClose();
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleFormSubmit(onSubmit)}>
        <div className="comment-modal">
          <h2 className="comment-modal-title">Add Comment</h2>

          <div className="comment-form">
            <Input
              label={`Comment for "${postKeyword}"`}
              placeholder="Enter your comment..."
              value={keyword}
              register={register("keyword")}
              error={errors.keyword}
            />
          </div>

          <div className="recording-timer">{formatTime(recordingTime)}</div>

          <div className="recording-controls">
            {!isRecording ? (
              <Button onClick={startRecording}>
                <Mic size={20} />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording}>
                <Square size={20} />
                Stop
              </Button>
            )}
          </div>

          <div className="recordings-section">
            <h3 className="recordings-section-title">Recording (Optional)</h3>
            {!recording ? (
              <p className="no-recordings-message">No recording yet</p>
            ) : (
              <div className="recording-item">
                <div className="recording-item-header">
                  <button
                    className="recording-delete-button"
                    onClick={deleteRecording}
                  >
                    Delete
                  </button>
                </div>
                <audio src={recording.url} controls />
              </div>
            )}
          </div>

          <div className="submit-button">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default AddCommentModal;
