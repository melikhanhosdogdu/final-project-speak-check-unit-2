import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../../components/Modal";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import { postAPI } from "../../shared/api/api";
import "./EditPostModal.css";

const editSchema = z.object({
  text: z.string().min(1, "Text is required"),
  language: z.string().min(1, "Language is required"),
});

function EditPostModal({ isOpen, onClose, post, onPostUpdated }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      text: post?.text || "",
      language: post?.language || "",
    },
  });

  useEffect(() => {
    if (post) {
      reset({ text: post.text, language: post.language });
    }
  }, [post, reset]);

  const selectedLanguage = watch("language");

  const onSubmit = async (data) => {
    try {
      const response = await postAPI.update(post.id, data);
      onPostUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="edit-post-modal">
          <h2 className="edit-post-modal-title">Edit Post</h2>

          <div className="edit-post-form">
            <div className="edit-post-form-group">
              <label className="edit-post-form-label">Language</label>
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
              label="Text"
              placeholder="Enter text..."
              register={register("text")}
              error={errors.text}
            />
          </div>

          <div className="edit-post-submit">
            <Button type="submit" isLoading={isSubmitting}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EditPostModal;
