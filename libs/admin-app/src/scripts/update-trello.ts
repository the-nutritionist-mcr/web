import fetch from 'node-fetch';
import Git from 'nodegit';

interface Commit {
  message: string;
  hash: string;
}

interface Tickets {
  [ticketNumber: string]: { commits: Commit[]; cardId: string };
}

const shortHash = (hash: string) => hash.substring(0, 5);

const searchGitLog = async (string: string): Promise<Commit[]> => {
  const repo = await Git.Repository.open('.git');
  const head = await repo.getHeadCommit();
  const commits: Commit[] = [];
  const historyWalker = head.history();
  historyWalker.on('commit', (commit: Git.Commit) => {
    const message = commit.message().replace(/\n$/gu, ``);
    if (message.includes(string)) {
      commits.push({ message, hash: shortHash(commit.sha()) });
    }
  });

  return await new Promise<Commit[]>((accept) => {
    historyWalker.on('end', () => {
      accept(commits);
    });
    historyWalker.start();
  });
};

const trelloRequest = async (
  method: string,
  path: string,
  query?: { [key: string]: string }
) => {
  const queryString = query
    ? Object.entries(query)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&')
    : undefined;
  const baseUrl = `https://api.trello.com/1${path}`;
  const url = query ? `${baseUrl}?${queryString}` : baseUrl;
  const response = await fetch(url, {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_KEY}", oauth_token="${process.env.TRELLO_TOKEN}"`,
    },
  });

  return await response.json();
};

const trello = {
  get: trelloRequest.bind(null, 'GET'),
  post: trelloRequest.bind(null, 'POST'),
};

// return await fetch("https://api.trello.com/1/boards/OfdLJmww/cards")

const commentNewCommits = async () => {
  const boardData = await trello.get('/boards/OfdLJmww/cards');

  const getCardIdFromBoardData = (ticket: string) =>
    boardData.find(
      (card: { idShort: number }) =>
        card.idShort == Number.parseInt(ticket.split('-')[1], 10)
    )?.id ?? '';

  const commits = await searchGitLog('TRELLO-');

  const getTicketFromMessage = (message: string) =>
    message.match(/TRELLO-\d+/gu)?.[0];

  const withTickets = commits.map((commit) => ({
    ...commit,
    ticket: getTicketFromMessage(commit.message),
  }));

  const tickets = withTickets.reduce<Tickets>(
    (tickets, commit) => ({
      ...tickets,
      [commit.ticket ?? '(none)']:
        commit.ticket && Object.hasOwnProperty.call(tickets, commit.ticket)
          ? {
              ...tickets[commit.ticket],
              commits: [...tickets[commit.ticket].commits, commit],
            }
          : {
              commits: [commit],
              cardId: getCardIdFromBoardData(commit.ticket ?? ''),
            },
    }),
    {}
  );

  interface Action {
    id: string;
    data: {
      text: string;
    };
    type: 'commentCard';
    date: string;
  }

  const titleCase = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  await Promise.all(
    Object.entries(tickets).map(async ([ticket, details]) => {
      const id = details.cardId;
      if (id) {
        const actions: Action[] = await trello.get(`/cards/${id}/actions`);

        const comments = actions.filter(
          (action) => action.type === 'commentCard'
        );

        const commitsToComment = details.commits.filter(
          (commit) =>
            !comments.some((comment) => comment.data.text.includes(commit.hash))
        );

        const changes = commitsToComment.map((commit) => {
          const message = commit.message
            .split(':')[1]
            .replace(/TRELLO-\d+/gu, ``);
          const link = `([github link](https://github.com/benwainwright/tnm/commit/${commit.hash}))`;
          return `- ${titleCase(message.trim())} ${link}`;
        });

        const changeString = changes.length > 1 ? 'change' : 'changes';

        const aString = changes.length > 1 ? '' : 'a ';

        const text = [
          `**Related ${titleCase(changeString)} Released**`,
          ``,
          `This is an automatic message to let you know that ${aString}${changeString} relating to this ticket has now been released to the main branch`,
          ``,
          ...changes,
        ].join('\n');

        await trello.post(`/cards/${id}/actions/comments`, {
          text,
        });
      }
    })
  );
  console.log('Finished adding comments!');
};

if (process.env.DEPLOYMENT_ENVIRONMENT === 'prod') {
  commentNewCommits();
}
