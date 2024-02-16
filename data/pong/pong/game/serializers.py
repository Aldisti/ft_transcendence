def serialize_game_matches(participants, opponents, games):
    data = []
    for participant, opponent, game in zip(participants, opponents, games):
        match = {
            "opponent": opponent.player_id,
            "scores": [participant.stats.score, opponent.stats.score],
            "date": game.get_created(),
        }
        data.append(match)
    return data
