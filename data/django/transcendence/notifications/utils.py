# Global group notification
G_N_GROUP = "global_notification"


# Notification types
class NotificationTypes:
    FRIEND_REQ = "friend_req"
    MATCH_REQ = "match_req"
    INFO = "info"
    ALLERT = "allert"
    BAN = "ban"
    NOTIFICATION_CHOICES = [
        (MATCH_REQ, "match_req"),
        (FRIEND_REQ, "friend_req"),
        (INFO, "info"),
        (ALLERT, "allert"),
        (BAN, "ban"),
    ]
