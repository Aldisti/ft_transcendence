
def shrink_dict(dictionary: dict, white_list: list | tuple) -> dict:
    return {key: dictionary[key] for key in white_list}
