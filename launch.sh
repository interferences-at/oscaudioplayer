# !/bin/bash
unclutter -idle 2 &

sleep 5

#xdotool windowminimize $(xdotool getactivewindow)

cd /home/pi/oscaudioplayer
node . &

sleep 3

chromium-browser --kiosk --app --new-window --incognito --autoplay-policy=no-user-gesture-required "/home/pi/oscaudioplayer/web/index.html" &

amixer set PCM - 100%
