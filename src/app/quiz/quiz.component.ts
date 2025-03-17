import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

@Component({
  selector: 'app-quiz',
  imports:[CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  questions: Question[] = [
    {
      question: '¿Cuál es la capital de Francia?',
      options: ['Madrid', 'Berlín', 'París', 'Roma'],
      correctAnswer: 'París'
    },
    {
      question: '¿Quién pintó la Mona Lisa?',
      options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
      correctAnswer: 'Leonardo da Vinci'
    },
    {
      question: '¿Cuál es el océano más grande?',
      options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
      correctAnswer: 'Pacífico'
    }
  ];

  currentQuestionIndex = 0;
  score = 0;
  timer = 30; // 30 segundos para cada pregunta
  isGameOver = false;
  selectedAnswer = '';
  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.nextQuestion();
      }
    }, 1000);
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
  }

  checkAnswer(): void {
    if (this.selectedAnswer === this.questions[this.currentQuestionIndex].correctAnswer) {
      this.score++;
    }
    this.nextQuestion();
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.timer = 30; // Reinicia el temporizador para la siguiente pregunta
      this.selectedAnswer = '';
    } else {
      this.isGameOver = true;
      clearInterval(this.interval); // Detiene el temporizador cuando se acaba el juego
    }
  }

  restartGame(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.timer = 30;
    this.isGameOver = false;
    this.startTimer();
  }
}
