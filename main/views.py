from django.shortcuts import render, redirect 

from django.http import HttpResponse

from .forms import CreateUserForm

from django.contrib.auth.forms import UserCreationForm

# Create your views here.
def home(request):
	return render(request, 'main/home.html')


def QuizList(request):
	return render(request, 'main/Quiz1.html')

def CreateUserForm(request):
	if request.user.is_authenticated:
		return redirect('home')
	else:
		#form = UserCreationForm()
		form = CreateUserForm()
		#if request.method == 'POST':
		#	form = CreateUserForm(request.POST)
		#	if form.is_valid():
		#		form.save()
		#		user = form.cleaned_data.get('username')
		#		messages.success(request, 'Account was created for ' + user)
#
		#		return redirect('login')
			

		context = {'form':form}
		return render(request, 'main/register.html', context)