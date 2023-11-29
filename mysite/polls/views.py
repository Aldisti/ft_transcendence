from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from .models import Question, Choice

# Create your views here.


class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "question_list"

    def get_queryset(self):
        return Question.objects.filter(date__lte=timezone.now()).order_by("-date")

# def index(request):
#     latestQuestions = Question.objects.order_by("-date")
#     context = {"question_list": latestQuestions}
#     return render(request, "polls/index.html", context)


class DetailView(generic.DetailView):
    model = Question
    template_name = "polls/detail.html"

# def detail(request, id):
#     question = get_object_or_404(Question, pk=id)
#     return render(request, "polls/detail.html", {"question": question})


class ResultsView(generic.DetailView):
    model = Question
    template_name = "polls/results.html"

# def results(request, id):
#     question = get_object_or_404(Question, pk=id)
#     return render(request, "polls/results.html", {"question": question})
#     return HttpResponse(response)


def vote(request, id):
    question = get_object_or_404(Question, pk=id)
    try:
        selected = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected.votes += 1
        selected.save()
    return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))
