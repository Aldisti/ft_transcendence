# Notification types
class NotificationTypes:
    FRIEND_REQ = "friend_req"
    TOURNAMENT_REQ = "tournament_req"
    MATCH_REQ = "match_req"
    INFO = "info"
    ALERT = "alert"
    BAN = "ban"
    NOTIFICATION_CHOICES = [
        (FRIEND_REQ, "friend_req"),
        (TOURNAMENT_REQ, "tournament_req"),
        (MATCH_REQ, "match_req"),
        (INFO, "info"),
        (ALERT, "alert"),
        (BAN, "ban"),
    ]
