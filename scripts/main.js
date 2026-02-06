/**
 * Portfolio Terminal — Interactive CLI + Navigation
 * Zero dependencies. Pure ES6+.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    initNavigation();
    initSectionObserver();
});

/* ═══════════════════════════════════════════
   Interactive Terminal
   ═══════════════════════════════════════════ */

function initTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const terminalEl = document.getElementById('terminal');

    if (!output || !input || !terminalEl) return;

    const state = {
        history: [],
        historyIdx: -1
    };

    // Click anywhere on terminal to focus input
    terminalEl.addEventListener('click', () => input.focus());

    // Autofocus on page load
    input.focus();

    // Key handling
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            if (cmd) {
                state.history.push(cmd);
                state.historyIdx = state.history.length;
            }
            executeCommand(cmd, output);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.historyIdx > 0) {
                state.historyIdx--;
                input.value = state.history[state.historyIdx];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (state.historyIdx < state.history.length - 1) {
                state.historyIdx++;
                input.value = state.history[state.historyIdx];
            } else {
                state.historyIdx = state.history.length;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            autocomplete(input);
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            output.innerHTML = '';
        }
    });

    // Print welcome
    printLine(output, "Welcome to Siddhanta's portfolio.", 'system');
    printLine(output, "Type <span class='hl-cmd'>help</span> to get started.", 'system');
    printLine(output, '', 'blank');
}

/* ─── Command Registry ────────────────── */

const COMMANDS = {

    help: () => [
        '<span class="hl-comment">Available commands:</span>',
        '',
        '  <span class="hl-cmd">about</span>        Who I am',
        '  <span class="hl-cmd">experience</span>   Work history',
        '  <span class="hl-cmd">projects</span>     Things I\'ve built',
        '  <span class="hl-cmd">skills</span>       Technical stack',
        '  <span class="hl-cmd">contact</span>      Get in touch',
        '  <span class="hl-cmd">resume</span>       Open my resume',
        '  <span class="hl-cmd">github</span>       Visit my GitHub',
        '  <span class="hl-cmd">neofetch</span>     System info',
        '',
        '<span class="hl-comment">Navigation:</span>',
        '  <span class="hl-cmd">goto</span> <span class="hl-flag">&lt;section&gt;</span>   Jump to section',
        '',
        '<span class="hl-comment">Also try:</span> ls, cat, whoami, pwd, date, clear',
    ].join('\n'),

    about: () => [
        '<span class="hl-key">Siddhanta Gupta</span>',
        'Software Engineer @ Styldod, Inc.',
        '',
        'Full-stack engineer with 4+ years building production-grade',
        'web applications. I ship things from concept to deployment —',
        'React frontends, Node/Python backends, AWS infra.',
        '',
        'Based in Bengaluru, India.',
    ].join('\n'),

    experience: () => [
        '<span class="hl-comment">$ git log --oneline --author="siddhanta"</span>',
        '',
        '<span class="hl-date">[08/2024 - Present]</span>  <span class="hl-company">Styldod, Inc.</span>',
        '                      <span class="hl-role">Software Engineer · Bengaluru</span>',
        '',
        '<span class="hl-date">[07/2023 - 03/2024]</span>  <span class="hl-company">Bitkraft Technologies</span>',
        '                      <span class="hl-role">Software Engineer · Remote</span>',
        '',
        '<span class="hl-date">[10/2022 - 04/2023]</span>  <span class="hl-company">Squareboat</span>',
        '                      <span class="hl-role">Software Engineer · Gurugram</span>',
        '',
        '<span class="hl-date">[09/2021 - 10/2022]</span>  <span class="hl-company">Bitkraft Technologies</span>',
        '                      <span class="hl-role">Software Engineer · Remote</span>',
        '',
        'Type <span class="hl-cmd">resume</span> for full details.',
    ].join('\n'),

    projects: () => [
        '<span class="hl-comment">$ ls -la ~/projects/</span>',
        '',
        '<span class="hl-foss">FOSS</span>  windows-workspaces     i3wm for Windows',
        '<span class="hl-foss">FOSS</span>  expressjs-boilerplate  Production Node starter',
        '<span class="hl-foss">FOSS</span>  advent-of-code         Programming challenges',
        '<span class="hl-pro">PRO </span>  digimaker-web-ide      Browser IDE + terminal',
        '<span class="hl-pro">PRO </span>  navigator-auth         OAuth2/OIDC server',
        '<span class="hl-pro">PRO </span>  icog-lms               Course authoring platform',
        '<span class="hl-pro">PRO </span>  ar-treasure-hunt       AR mobile game',
        '<span class="hl-pro">PRO </span>  healify-virtual-pt     Pose analysis with CV',
        '<span class="hl-pro">PRO </span>  isl-doc-repo           Document management',
        '<span class="hl-pro">PRO </span>  formly-v2              React + TS rebuild',
        '',
        'Type <span class="hl-cmd">goto projects</span> to scroll to details.',
    ].join('\n'),

    skills: () => [
        '<span class="hl-comment">$ cat stack.toml</span>',
        '',
        '<span class="hl-section">[languages]</span>',
        '<span class="hl-key">primary</span> = <span class="hl-bracket">[</span><span class="hl-string">"JavaScript"</span>, <span class="hl-string">"Python"</span>, <span class="hl-string">"TypeScript"</span><span class="hl-bracket">]</span>',
        '',
        '<span class="hl-section">[frontend]</span>',
        '<span class="hl-key">frameworks</span> = <span class="hl-bracket">[</span><span class="hl-string">"React"</span><span class="hl-bracket">]</span>',
        '',
        '<span class="hl-section">[backend]</span>',
        '<span class="hl-key">frameworks</span> = <span class="hl-bracket">[</span><span class="hl-string">"Node.js"</span>, <span class="hl-string">"Express"</span>, <span class="hl-string">"Django"</span><span class="hl-bracket">]</span>',
        '',
        '<span class="hl-section">[databases]</span>',
        '<span class="hl-key">engines</span> = <span class="hl-bracket">[</span><span class="hl-string">"MongoDB"</span>, <span class="hl-string">"SQL"</span>, <span class="hl-string">"Redis"</span><span class="hl-bracket">]</span>',
        '',
        '<span class="hl-section">[infrastructure]</span>',
        '<span class="hl-key">cloud</span> = <span class="hl-bracket">[</span><span class="hl-string">"AWS"</span><span class="hl-bracket">]</span>, <span class="hl-key">containers</span> = <span class="hl-bracket">[</span><span class="hl-string">"Docker"</span><span class="hl-bracket">]</span>, <span class="hl-key">os</span> = <span class="hl-bracket">[</span><span class="hl-string">"Linux"</span><span class="hl-bracket">]</span>',
    ].join('\n'),

    contact: () => [
        '<span class="hl-comment">$ cat ~/.contact</span>',
        '',
        '  <span class="hl-key">email</span>     <span class="hl-link" data-href="mailto:siddhanta.sg@gmail.com">siddhanta.sg@gmail.com</span>',
        '  <span class="hl-key">github</span>    <span class="hl-link" data-href="https://github.com/SiddhantaGupta">github.com/SiddhantaGupta</span>',
        '  <span class="hl-key">linkedin</span>  <span class="hl-link" data-href="https://www.linkedin.com/in/siddhantagupta">linkedin.com/in/siddhantagupta</span>',
        '',
        'Type <span class="hl-cmd">mail</span> to open email client.',
    ].join('\n'),

    neofetch: () => [
        '<span class="nf-c1">███  ████</span>   <span class="nf-user">siddhanta</span><span class="nf-at">@</span><span class="nf-host">portfolio</span>',
        '<span class="nf-c2">█    █   </span>   ───────────────────',
        '<span class="nf-c3">███  █ ██</span>   <span class="hl-key">role  </span>  Software Engineer',
        '<span class="nf-c4">  █  █  █</span>   <span class="hl-key">loc   </span>  Bengaluru, India',
        '<span class="nf-c5">███  ████</span>   <span class="hl-key">exp   </span>  4+ years',
        '               <span class="hl-key">stack </span>  JS · Python · Node · React',
        '               <span class="hl-key">infra </span>  AWS · Docker · Linux',
        '               <span class="hl-key">db    </span>  MongoDB · SQL · Redis',
    ].join('\n'),

    resume: () => {
        window.open('resume.html', '_blank');
        return 'Opening resume...';
    },

    github: () => {
        window.open('https://github.com/SiddhantaGupta', '_blank');
        return 'Opening GitHub...';
    },

    mail: () => {
        window.location.href = 'mailto:siddhanta.sg@gmail.com';
        return 'Opening mail client...';
    },

    linkedin: () => {
        window.open('https://www.linkedin.com/in/siddhantagupta', '_blank');
        return 'Opening LinkedIn...';
    },

    clear: 'CLEAR',

    goto: (args) => {
        const section = args[0];
        if (!section) return 'Usage: goto <span class="hl-flag">&lt;section&gt;</span>\nSections: projects, skills, contact';
        const el = document.getElementById(section);
        if (el) {
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--status-h')) || 36;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            return `Navigating to ${section}...`;
        }
        return `Section not found: ${section}. Try: projects, skills, contact`;
    },

    // Filesystem simulation
    whoami: () => 'visitor — Welcome to my portfolio.',
    pwd: () => '/home/siddhanta/portfolio',
    date: () => new Date().toString(),
    uptime: () => '4+ years and counting...',
    echo: (args) => args.join(' ') || '',
    hostname: () => 'portfolio.siddhantagupta.dev',

    ls: (args) => {
        const target = (args[0] || '.').replace(/\/$/, '');
        const dirs = {
            '.':          'about.md  projects/  skills.toml  contact.md  resume.pdf',
            'projects':   'windows-workspaces/  expressjs-boilerplate/  digimaker-ide/\nnavigator-auth/  icog-lms/  ar-treasure-hunt/  healify-virtual-pt/\nisl-doc-repo/  formly-v2/  advent-of-code/',
        };
        return dirs[target] || `ls: cannot access '${args[0]}': No such file or directory`;
    },

    cat: (args) => {
        if (!args.length) return 'cat: missing file operand';
        const file = args[0].replace(/\.(md|toml|json|pdf|txt)$/, '');
        const aliases = { 'about': 'about', 'skills': 'skills', 'contact': 'contact', 'resume': 'resume' };
        const cmd = aliases[file];
        if (cmd && COMMANDS[cmd]) {
            const fn = COMMANDS[cmd];
            return typeof fn === 'function' ? fn([]) : fn;
        }
        return `cat: ${args[0]}: No such file or directory`;
    },

    // Blog
    blog: () => {
        return [
            '<span class="hl-comment">$ ls ~/blog/</span>',
            '',
            '  how_to_use_websockets_like_a_pro.html',
            '',
            'Type <span class="hl-cmd">open blog</span> to read it.',
        ].join('\n');
    },

    open: (args) => {
        const target = args[0];
        if (target === 'blog') {
            window.open('blogs/how_to_use_websockets_like_a_pro.html', '_blank');
            return 'Opening blog post...';
        }
        if (target === 'github') return COMMANDS.github();
        if (target === 'linkedin') return COMMANDS.linkedin();
        if (target === 'resume') return COMMANDS.resume();
        return `open: ${target || '?'}: No such file or application`;
    },

    // Easter eggs
    sudo: () => 'Nice try. Permission denied.',
    rm: (args) => {
        if (args.join(' ').includes('-rf')) return 'Permission denied. Good thing.';
        return 'rm: missing operand';
    },
    vim: () => 'I use neovim btw. (You\'re already trapped in this terminal.)',
    nano: () => 'nano? Bold choice.',
    exit: () => 'There\'s no escape. You\'re in my portfolio now.',
    'ctrl+c': () => '^C',
    htop: () => [
        'CPU [████████████████████░░░░░░]  78%  coding',
        'MEM [██████████████░░░░░░░░░░░░]  52%  projects',
        'SWP [████░░░░░░░░░░░░░░░░░░░░░░]  16%  coffee',
    ].join('\n'),
};

/* ─── Execution ───────────────────────── */

function executeCommand(raw, output) {
    // Print the input line
    printLine(output,
        `<span class="tl-prompt">visitor@portfolio</span><span class="tl-sep">:</span><span class="tl-dir">~</span><span class="tl-dollar">$</span> ${escapeHtml(raw)}`,
        'input'
    );

    if (!raw) return;

    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const handler = COMMANDS[cmd];

    if (!handler) {
        printLine(output, `command not found: ${escapeHtml(cmd)}. Type <span class="hl-cmd">help</span> for commands.`, 'error');
        printLine(output, '', 'blank');
        return;
    }

    if (handler === 'CLEAR') {
        output.innerHTML = '';
        return;
    }

    const result = typeof handler === 'function' ? handler(args) : handler;
    if (result) {
        printLine(output, result, 'output');
    }
    printLine(output, '', 'blank');
}

/* ─── Output Helpers ──────────────────── */

function printLine(output, text, type) {
    const div = document.createElement('div');
    div.className = `terminal-line terminal-line--${type || 'output'}`;
    div.innerHTML = text;
    output.appendChild(div);

    // Scroll the terminal container (not the output div) to keep prompt visible
    const terminal = output.closest('.terminal');
    if (terminal) terminal.scrollTop = terminal.scrollHeight;

    // Make clickable links work
    div.querySelectorAll('.hl-link[data-href]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(link.dataset.href, '_blank');
        });
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ─── Tab Autocomplete ────────────────── */

function autocomplete(input) {
    const val = input.value.trim().toLowerCase();
    if (!val) return;

    const parts = val.split(/\s+/);
    const partial = parts[parts.length - 1];
    const cmdNames = Object.keys(COMMANDS);

    // If typing first word, complete command name
    if (parts.length === 1) {
        const matches = cmdNames.filter(c => c.startsWith(partial));
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        }
    }

    // If typing second word for 'goto', complete section name
    if (parts.length === 2 && parts[0] === 'goto') {
        const sections = ['projects', 'skills', 'contact', 'hero'];
        const matches = sections.filter(s => s.startsWith(partial));
        if (matches.length === 1) {
            input.value = parts[0] + ' ' + matches[0];
        }
    }
}

/* ═══════════════════════════════════════════
   Navigation — Smooth Scroll + Active Tab
   ═══════════════════════════════════════════ */

function initNavigation() {
    const tabs = document.querySelectorAll('.status-bar__tab');
    const statusH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--status-h')) || 36;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const href = tab.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const top = target.getBoundingClientRect().top + window.scrollY - statusH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

/* ─── Active Tab Tracking (scroll-based) ─ */

function initSectionObserver() {
    const tabs = document.querySelectorAll('.status-bar__tab');
    const sections = [...document.querySelectorAll('section[id]')];
    const statusH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--status-h')) || 36;

    let ticking = false;

    function updateActiveTab() {
        // If scrolled to the bottom, the last section wins regardless
        // (handles short trailing sections like contact).
        const atBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2;

        let activeId = sections[0]?.id;

        if (atBottom) {
            activeId = sections[sections.length - 1]?.id;
        } else {
            // Walk top-to-bottom; last section whose top passed the
            // status bar (+ buffer) is the current one.
            for (const section of sections) {
                if (section.getBoundingClientRect().top <= statusH + 80) {
                    activeId = section.id;
                }
            }
        }

        tabs.forEach(tab => {
            tab.classList.toggle(
                'status-bar__tab--active',
                tab.dataset.section === activeId
            );
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateActiveTab);
            ticking = true;
        }
    }, { passive: true });

    // Run once on load to set the correct initial state
    updateActiveTab();
}
