// breakout.component.ts
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-breakout',
  templateUrl: './breakout.component.html',
  styleUrl: './breakout.component.scss'
})
export class BreakoutComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private score: number = 0;

  private brickRowCount: number = 9;
  private brickColumnCount: number = 5;
  private delay: number = 500;
  private brickSound = new Audio('assets/sounds/brick.mp3');
  private paddleSound = new Audio('assets/sounds/paddle.mp3');
  private wallSound = new Audio('assets/sounds/wall.mp3');

  private ball = {
    x: 0,
    y: 0,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
  };

  private paddle = {
    x: 0,
    y: 0,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
    visible: true
  };

  private brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
  };

  private bricks: any[][] = [];

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.initializeGame();
    this.update();
  }

  private initializeGame(): void {
    this.ball.x = this.canvas.nativeElement.width / 2;
    this.ball.y = this.canvas.nativeElement.height / 2;
    this.paddle.x = this.canvas.nativeElement.width / 2 - 40;
    this.paddle.y = this.canvas.nativeElement.height - 20;

    for (let i = 0; i < this.brickRowCount; i++) {
      this.bricks[i] = [];
      for (let j = 0; j < this.brickColumnCount; j++) {
        const x = i * (this.brickInfo.w + this.brickInfo.padding) + this.brickInfo.offsetX;
        const y = j * (this.brickInfo.h + this.brickInfo.padding) + this.brickInfo.offsetY;
        this.bricks[i][j] = { x, y, ...this.brickInfo };
      }
    }
  }

  private drawBall(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.ball.visible ? '#0095dd' : 'transparent';
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawPaddle(): void {
    this.ctx.beginPath();
    this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);
    this.ctx.fillStyle = this.paddle.visible ? '#0095dd' : 'transparent';
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawScore(): void {
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.nativeElement.width - 100, 30);
  }

  private drawBricks(): void {
    this.bricks.forEach(column => {
      column.forEach(brick => {
        this.ctx.beginPath();
        this.ctx.rect(brick.x, brick.y, brick.w, brick.h);
        this.ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
        this.ctx.fill();
        this.ctx.closePath();
      });
    });
  }

  private movePaddle(): void {
    this.paddle.x += this.paddle.dx;

    if (this.paddle.x + this.paddle.w > this.canvas.nativeElement.width) {
      this.paddle.x = this.canvas.nativeElement.width - this.paddle.w;
    }
    if (this.paddle.x < 0) {
      this.paddle.x = 0;
    }
  }

  private moveBall(): void {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // rebote paredes laterales
    if (this.ball.x + this.ball.size > this.canvas.nativeElement.width || this.ball.x - this.ball.size < 0) {
      this.ball.dx *= -1;
      this.wallSound.play();

    }
    if (this.ball.y + this.ball.size > this.canvas.nativeElement.height || this.ball.y - this.ball.size < 0) {
      this.ball.dy *= -1;
    }

    if (
      this.ball.x - this.ball.size > this.paddle.x &&
      this.ball.x + this.ball.size < this.paddle.x + this.paddle.w &&
      this.ball.y + this.ball.size > this.paddle.y
    ) {
      this.ball.dy = -this.ball.speed;
      this.paddleSound.play();
    }

    this.bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.visible) {
          if (
            this.ball.x - this.ball.size > brick.x &&
            this.ball.x + this.ball.size < brick.x + brick.w &&
            this.ball.y + this.ball.size > brick.y &&
            this.ball.y - this.ball.size < brick.y + brick.h
          ) {
            this.ball.dy *= -1;
            brick.visible = false;
            this.increaseScore();
            this.brickSound.play();
          }
        }
      });
    });

    if (this.ball.y + this.ball.size > this.canvas.nativeElement.height) {
      this.showAllBricks();
      this.score = 0;
    }
  }

  private increaseScore(): void {
    this.score++;

    if (this.score % (this.brickRowCount * this.brickColumnCount) === 0) {
      this.ball.visible = false;
      this.paddle.visible = false;

      setTimeout(() => {
        this.showAllBricks();
        this.score = 0;
        this.paddle.x = this.canvas.nativeElement.width / 2 - 40;
        this.paddle.y = this.canvas.nativeElement.height - 20;
        this.ball.x = this.canvas.nativeElement.width / 2;
        this.ball.y = this.canvas.nativeElement.height / 2;
        this.ball.visible = true;
        this.paddle.visible = true;
      }, this.delay);
    }
  }

  private showAllBricks(): void {
    this.bricks.forEach(column => {
      column.forEach(brick => (brick.visible = true));
    });
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.drawBricks();
  }

  private update(): void {
    this.movePaddle();
    this.moveBall();
    this.draw();
    requestAnimationFrame(() => this.update());
  }

  // Keyboard controls
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.paddle.dx = this.paddle.speed;
    } else if (event.key === 'ArrowLeft') {
      this.paddle.dx = -this.paddle.speed;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      this.paddle.dx = 0;
    }
  }

  // Mouse controls
  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    // Center the paddle on the mouse position
    this.paddle.x = mouseX - this.paddle.w / 2;

    // Keep paddle within canvas bounds
    if (this.paddle.x + this.paddle.w > this.canvas.nativeElement.width) {
      this.paddle.x = this.canvas.nativeElement.width - this.paddle.w;
    }
    if (this.paddle.x < 0) {
      this.paddle.x = 0;
    }
  }

  // Rules toggle methods
  showRules(): void {
    const rules = document.getElementById('rules');
    rules?.classList.add('show');
  }

  hideRules(): void {
    const rules = document.getElementById('rules');
    rules?.classList.remove('show');
  }
}
