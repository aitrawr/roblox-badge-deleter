# roblox-badge-deleter
using js and your browser console you can delete badges automatically, please this is important to notice that you NEED to run the code in your web browser.

# Q&A

## 1. Why does it need to fetch `https://auth.roblox.com/v1/logout`? Is it a way to log me out of my Roblox account to steal my Robux?
The fetch is used to obtain a CSRF token, not to log you out. It ensures the script can safely interact with Roblox's servers.

## 2. What’s a CSRF token, and why does it take it? Is it to log into my account and hack me?
A CSRF token is a security measure to prevent unauthorized actions on your account. The script uses it to confirm that requests are made by you and not by malicious entities.

## 3. Can I get banned using this?
It is EXTREMELY unlikely that you get banned.

## 4. Do I give you access to my account if I run this code?
No, running the code does not give anyone access to your account. However, it interacts with your account data through the API.

## 5. VM5937:30 Failed to set token, status code: 401
it should tell you to check if you're logged in, else refresh the page or log out all session.

## 6. "Failed to fetch badges, status code: 404"
Check if your roblox ID has been put in the first line.

## 7. im scared what if whitelist doesnt work
It will work. Simply keep the format ["BADGE_ID_1", "BADGE_ID_2", "BADGE_ID_3"]; if you want to add new badges to whitelist

### Add my discord "ilovesatire" for questions




#
### Easiest way to run the code.

https://youtu.be/AHnciy2X6QY
