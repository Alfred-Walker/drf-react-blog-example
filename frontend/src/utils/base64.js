export const getBase64UrlsFromContents = (quillEditor) => {
    var editor = quillEditor;
    const contents = editor.getContents();

    var ops = contents.ops;
    var base64Urls = [];

    if (ops) {
        for (var op in ops) {
            if (ops[op].insert && ops[op].insert.image) {
                base64Urls.push(ops[op].insert.image);
            }
        }
    }

    return base64Urls;
}

export const getImgBlobs = (base64Urls) => {
    return Promise.all(base64Urls.map(url => url.blob()));
}

export const getFormDataForBlobs = (blobs, key) => {
    var formData = new FormData();
    blobs.map(blob => formData.append(key, blob));
    return formData;
}

export default { getBase64UrlsFromContents, getImgBlobs, getFormDataForBlobs };
