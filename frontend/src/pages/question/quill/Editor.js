export const QuillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "size",
    "color",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "code",
    "code-block"
];

export const QuillModules = {
    toolbar: {
        container: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ size: ["small", false, "large", "huge"] }, { color: [] }],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
                { align: [] }
            ],
            ["link", "image", "video", "code-block"],
            ["clean"]
        ],
        // handlers: { image: this.imageHandler }
    },
    clipboard: { matchVisual: false }
};

// (Deprecated)
    // imageHandler() {
    //     // Custom Image Handler
    //     // (to replace base64 url with the url getting from server)
    //     // https://github.com/quilljs/quill/issues/2034
    //     }
    //   }

export default { QuillFormats, QuillModules };