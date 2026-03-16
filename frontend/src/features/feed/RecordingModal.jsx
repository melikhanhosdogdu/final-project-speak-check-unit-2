import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mic, Square } from "lucide-react";
import Modal from "../../components/Modal";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import "./RecordingModal.css";
import { storageAPI, postAPI } from "../../shared/api/api";
import { fetchBackgroundImages } from "../../utils/fetch-backgrounds-images";

const recordingSchema = z.object({
  language: z.string().min(1, "Language is required"),
  keyword: z.string().min(1, "Keyword is required"),
  recording: z.any().refine((val) => val !== null, {
    message: "Recording is required",
  }),
});

function RecordingModal({ isOpen, onClose, onPostAdded }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // by milisecond
  const mediaRecorderRef = useRef(null); // voice recorder
  const chunksRef = useRef([]); // recorded audio chunks
  const timerRef = useRef(null);
  const recordingTimeRef = useRef(0);

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(recordingSchema),
    defaultValues: {
      language: "",
      keyword: "",
      recording: null,
    },
  });

  const selectedLanguage = watch("language");
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
    return "audio/webm"; // fallback
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
      alert("Microphone access problem: " + error.message);
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
    try {
      // Step 1: Generate upload URL
      // - I will use uploadData.uploadUrl to upload the recording
      // - I will save uploadData.key in the post data to retrieve the file later
      // - I will generate new URL using the key to play the recording in the feed - API will generate public URL for the file when I request it with the key
      const uploadData = await generateUploadURL(data.recording);

      // Step 2: Upload recording to the generated URL
      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": data.recording.type,
        },
        body: data.recording.blob,
      });

      if (uploadResponse.ok) {
      }

      // TMP
      // con;
      // const downloadData = await storageAPI.generateDownloadUrl(uploadData.key);

      // localStorage.setItem("uploadedRecordingKey", uploadData.key); // Save the key for later use

      // Step 2.5: Fetch background image (optional)
      const backgroundImageUrl = await fetchBackgroundImages();

      // Step 3: Create post
      const payload = {
        language: data.language,
        text: data.keyword,
        audioKey: uploadData.key,
        backgroundImageUrl: backgroundImageUrl,
      };

      const createdPost = await postAPI.create(payload);

      //TEM

      const newPost = {
        id: createdPost.data.id,
        username: createdPost.data.username,
        text: createdPost.data.text,
        language: createdPost.data.language,
        audioUrl: createdPost.data.audioUrl,
        likeCount: createdPost.data.likeCount,
        commentCount: createdPost.data.commentCount,
        isLikedByCurrentUser: createdPost.data.isLikedByCurrentUser,
        backgroundImageUrl: createdPost.data.backgroundImageUrl,
      };

      onPostAdded(newPost);
      reset();
      onClose();
    } catch (error) {
      // alert("Error uploading recording: " + error.message);
    }
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
        <div className="recording-modal">
          <h2 className="recording-modal-title">Record Audio</h2>

          <div className="recording-form">
            <div className="form-group">
              <label className="form-label">Language</label>
              <Dropdown
                options={LANGUAGE_OPTIONS}
                value={selectedLanguage}
                onChange={(option) => setValue("language", option.value)}
                placeholder="Select a language"
              />
              {errors.language && (
                <span className="error-message">{errors.language.message}</span>
              )}
            </div>

            <Input
              label="Keyword"
              placeholder="Enter keyword..."
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
            <h3 className="recordings-section-title">Recording</h3>
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
            {errors.recording && (
              <span className="error-message-for-recording">
                {errors.recording.message}
              </span>
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

export default RecordingModal;
