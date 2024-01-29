export default function escapeHtml(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[&<>"'\/]/g, function(match) {
        switch(match) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#x27;'; // HTML entity for single quote
            case "/":
                return '&#x2F;'; // HTML entity for forward slash
            default:
                return match;
        }
    });
}