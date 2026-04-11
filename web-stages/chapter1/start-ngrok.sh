#!/bin/bash

set -a
source .env
set +a

SESSION=$SESSION_NAME
FILE=$URL_FILE

echo "[*] Starting ngrok tunnels in tmux session: $SESSION"

tmux kill-session -t $SESSION 2>/dev/null
rm -f $FILE

tmux new-session -d -s $SESSION

tmux send-keys -t $SESSION "echo '[*] Stage1 → $PORT_A'; ngrok http $PORT_A --log=stdout" C-m

tmux split-window -h -t $SESSION
tmux send-keys -t $SESSION "echo '[*] Stage2 → $PORT_B'; ngrok http $PORT_B --log=stdout" C-m

tmux split-window -h -t $SESSION
tmux send-keys -t $SESSION "echo '[*] Stage3 → $PORT_C'; ngrok http $PORT_C --log=stdout" C-m

tmux select-layout -t $SESSION even-horizontal

if [[ -t 1 ]]; then
    tmux attach -t $SESSION
fi

sleep 5

curl --silent http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[].public_url' > $FILE

echo "[*] URLs:"
echo "Stage1: $(sed -n '1p' $FILE)"
echo "Stage2: $(sed -n '2p' $FILE)"
echo "Stage3: $(sed -n '3p' $FILE)"