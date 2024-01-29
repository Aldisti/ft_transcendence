# name of global group
G_GROUP = "global_group"

# class used in order to define accepted type of messages
class MessageTypes:
    GLOBAL = "global"
    PRIVATE = "private"
    ERROR = "error"
    TYPE_CHOICES_LIST = [GLOBAL, PRIVATE]
    TYPE_CHOICES = {
        (GLOBAL, "global"),
        (PRIVATE, "private"),
    }
