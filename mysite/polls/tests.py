from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from datetime import timedelta

from .models import Question


def create_question(text, days):
    """
    Create a question with the given `text` and published the
    given number of `days` offset to now (negative for questions published
    in the past, positive for questions that have yet to be published).
    """
    time = timezone.now() + timedelta(days=days)
    return Question.objects.create(text=text, date=time)


class QuestionIndexView(TestCase):
    def test_no_question(self):
        """
        If no questions exist, an appropriate message is displayed
        """
        response = self.client.get(reverse("polls:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No polls are available")
        self.assertQuerySetEqual(response.context["question_list"], [])

    def test_past_question(self):
        """
        Questions with a date in the past are displayed on the index page
        """
        question = create_question(text="test: past question", days=-5)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["question_list"],
            [question],
        )

    def test_future_question(self):
        """
        Questions with a pub_date in the future aren't displayed on
        the index page.
        """
        create_question(text="Future question.", days=30)
        response = self.client.get(reverse("polls:index"))
        self.assertContains(response, "No polls are available")
        self.assertQuerySetEqual(response.context["question_list"], [])

    def test_future_question_and_past_question(self):
        """
        Even if both past and future questions exist, only past questions
        are displayed.
        """
        question = create_question(text="Past question.", days=-30)
        create_question(text="Future question.", days=30)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["question_list"],
            [question],
        )

    def test_two_past_questions(self):
        """
        The questions index page may display multiple questions.
        """
        question1 = create_question(text="Past question 1.", days=-30)
        question2 = create_question(text="Past question 2.", days=-5)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["question_list"],
            [question2, question1],
        )

class QuestionModelTest(TestCase):
    def test_was_published_recently_with_future_question(self):
        """
        was_published_recently() returns False for questions whose date
        is in the future
        """
        time = timezone.now() + timedelta(minutes=1)
        question = Question(date=time)
        self.assertFalse(question.was_published_recently())

    def test_was_published_recently_with_past_question(self):
        """
        was_published_recently() returns False for questions whose date
        is older than 1 day
        """
        time = timezone.now() - timedelta(days=1, minutes=1)
        question = Question(date=time)
        self.assertFalse(question.was_published_recently())

    def test_was_published_recently_with_recent_question(self):
        """
        was_published_recently() returns False for questions whose date
        is within 1 day
        """
        time = timezone.now() - timedelta(hours=23, minutes=59)
        question = Question(date=time)
        self.assertTrue(question.was_published_recently())
