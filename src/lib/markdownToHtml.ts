
export function markdownToHtml(md: string): string {
    let html = md
        // Escape raw HTML to prevent XSS
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // ── Fenced code blocks (``` lang\n...\n```) — process FIRST before anything else
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="md-pre"><code class="md-code-block">${code.trimEnd()}</code></pre>`;
    });

    // ── Headings
    html = html.replace(/^###### (.+)$/gm, "<h6 class='md-h'>$1</h6>");
    html = html.replace(/^##### (.+)$/gm, "<h5 class='md-h'>$1</h5>");
    html = html.replace(/^#### (.+)$/gm, "<h4 class='md-h'>$1</h4>");
    html = html.replace(/^### (.+)$/gm, "<h3 class='md-h'>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2 class='md-h md-h2'>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1 class='md-h md-h1'>$1</h1>");

    // ── Horizontal rule
    html = html.replace(/^---$/gm, "<hr class='md-hr' />");

    // ── Blockquote
    html = html.replace(/^&gt; (.+)$/gm, "<blockquote class='md-blockquote'>$1</blockquote>");

    // ── Unordered lists (supports - and *)
    html = html.replace(/^[\-\*] (.+)$/gm, "<li class='md-li'>$1</li>");
    html = html.replace(/(<li class='md-li'>[\s\S]*?<\/li>)(?=\n[^<]|$)/g, "<ul class='md-ul'>$1</ul>");
    // wrap consecutive <li> into single <ul>
    html = html.replace(/<\/ul>\n<ul class='md-ul'>/g, "");

    // ── Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, "<li class='md-li'>$1</li>");
    html = html.replace(/(<li class='md-li'>[\s\S]*?<\/li>)(?=\n[^<]|$)/g, "<ol class='md-ol'>$1</ol>");
    html = html.replace(/<\/ol>\n<ol class='md-ol'>/g, "");

    // ── Tables
    html = html.replace(
        /^(\|.+\|)\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm,
        (_, header, rows) => {
            const ths = header.split("|").filter(Boolean).map(
                (h: string) => `<th class='md-th'>${h.trim()}</th>`
            ).join("");
            const trs = rows.trim().split("\n").map((row: string) => {
                const tds = row.split("|").filter(Boolean).map(
                    (d: string) => `<td class='md-td'>${d.trim()}</td>`
                ).join("");
                return `<tr>${tds}</tr>`;
            }).join("");
            return `<div class='md-table-wrap'><table class='md-table'><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
        }
    );

    // ── Inline: bold, italic, inline code, strikethrough, links, images
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong class='md-strong'>$1</strong>");
    html = html.replace(/__(.+?)__/g, "<strong class='md-strong'>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em class='md-em'>$1</em>");
    html = html.replace(/_(.+?)_/g, "<em class='md-em'>$1</em>");
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
    html = html.replace(/`([^`]+)`/g, "<code class='md-code'>$1</code>");
    html = html.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        "<img class='md-img' src='$2' alt='$1' />"
    );
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        "<a class='md-link' href='$2' target='_blank' rel='noopener noreferrer'>$1</a>"
    );

    // ── Paragraphs — wrap lines that aren't already block elements
    html = html.replace(
        /^(?!<[hpuol\-]|<pre|<hr|<table|<blockquote|<div)(.+)$/gm,
        "<p class='md-p'>$1</p>"
    );

    // ── Clean up extra blank lines
    html = html.replace(/\n{3,}/g, "\n\n");

    return html;
}