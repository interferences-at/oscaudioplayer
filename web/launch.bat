# !/bin/bash
unclutter -idle 2 &

sleep 5

xdotool windowminimize $(xdotool getactivewindow)

cd /home/pi/oscplayer
node .

sleep 3

chrome.exe --kiosk --autoplay-policy=no-user-gesture-required "C:\Users\simon\Documents\Compagnie\Clients\Louis-Robert Bouchard\MediaPlayer\web\index.html"
#chrome.exe --autoplay-policy=no-user-gesture-required "C:\Users\simon\Documents\Compagnie\Clients\Louis-Robert Bouchard\MediaPlayer\web\index.html"