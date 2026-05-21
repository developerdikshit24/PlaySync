export function formatParagraphs(text) {
    return text
        .split(/\n{2,}/) // split on double line breaks (i.e., separate paragraphs)
        .map(para =>
            para
                .split('\n') // preserve single line breaks inside a paragraph
                .map(line => line.trim())
                .join('<br/>') // replace single \n with <br/>
        )
        .filter(p => p !== '');
}