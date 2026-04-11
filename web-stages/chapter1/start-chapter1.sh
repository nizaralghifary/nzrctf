#!/bin/bash

tmux new-session -d -s ctfch1

tmux send-keys -t ctfch1 "nodemon stage1/app.js" C-m
tmux split-window -h -t ctfch1
tmux send-keys -t ctfch1 "nodemon stage2/app.js" C-m
tmux split-window -h -t ctfch1
tmux send-keys -t ctfch1 "nodemon stage3/app.js" C-m

tmux select-layout -t ctfch1 even-horizontal

tmux attach -t ctfch1