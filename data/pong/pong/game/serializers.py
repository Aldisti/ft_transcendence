from users.utils import Results

def serialize_game_matches(participants, opponents, games):
    data = []
    for participant, opponent, game in zip(participants, opponents, games):
        opponent_stats = getattr(opponent, "stats", None)
        opponent_score = getattr(opponent_stats, "score", 0)
        participant_stats = getattr(participant, "stats", None)
        participant_score = getattr(participant_stats, "score", 0)
        participant_result = getattr(participant_stats, "result", Results.LOSE)
        match = {
            "opponent": opponent.player_id,
            "scores": [participant_score, opponent_score],
            "date": game.get_created(),
            "result": participant_result,
        }
        data.append(match)
    return data
