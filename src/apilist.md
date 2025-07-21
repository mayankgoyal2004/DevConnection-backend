<!--! authRouter -->
post : login = /login
post : signIn = /signIn
post : logout = / logout 

<!--! profileRoute -->

get/profile/views
patch : profile/update
patch : profile/forgotPassword

<!-- !connectionRequest -->
post /request/send/interested/:userId
post /request/send/ignore/:userId
post /request/send/accept/:userId
post /request/send/reject/:userId

<!-- !userRouter -->
get /user/connections
get /user/requests
get /user/feed gets you the profile of other users on platform 