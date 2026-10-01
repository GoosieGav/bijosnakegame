import pygame
import random
import sys
import os

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 1200  # Smaller window
WINDOW_HEIGHT = 900   # Smaller window
GRID_SIZE = 100
GRID_WIDTH = 12  # Much fewer squares horizontally
GRID_HEIGHT = 9   # Much fewer squares vertically

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (34, 139, 34)
DARK_GREEN = (0, 100, 0)
RED = (255, 69, 0)
ORANGE = (255, 165, 0)
YELLOW = (255, 255, 0)
BLUE = (135, 206, 235)
PURPLE = (138, 43, 226)
BROWN = (139, 69, 19)
DARK_BROWN = (101, 67, 33)
LIGHT_BROWN = (160, 82, 45)

# Directions
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)

class Snake:
    def __init__(self):
        self.body = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.direction = RIGHT
        self.grow = False
        # Smooth movement variables for each segment
        self.smooth_positions = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.target_positions = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.moving = False
        
    def move(self):
        head_x, head_y = self.body[0]
        new_head = (head_x + self.direction[0], head_y + self.direction[1])
        
        # Check wall collision
        if (new_head[0] < 0 or new_head[0] >= GRID_WIDTH or 
            new_head[1] < 0 or new_head[1] >= GRID_HEIGHT):
            return False
            
        # Check self collision
        if new_head in self.body:
            return False
        
        # Update target positions for smooth movement
        # Each segment follows the one in front of it
        new_targets = [new_head]  # Head goes to new position
        for i in range(len(self.body)):
            new_targets.append(self.body[i])  # Each segment follows the previous one
        
        self.target_positions = new_targets
        self.moving = True
            
        self.body.insert(0, new_head)
        
        if not self.grow:
            self.body.pop()
            # Remove the last smooth position when body shrinks
            if len(self.smooth_positions) > len(self.body):
                self.smooth_positions.pop()
        else:
            self.grow = False
            # Add new smooth position when body grows
            if len(self.smooth_positions) < len(self.body):
                self.smooth_positions.append(self.body[-1])
            
        return True
    
    def update_smooth(self, dt):
        """Update smooth movement interpolation for all segments"""
        if self.moving:
            # Calculate movement speed (pixels per second)
            move_speed = 300  # Adjust this for faster/slower movement
            
            all_at_target = True
            
            # Update each segment's smooth position
            for i in range(len(self.smooth_positions)):
                if i < len(self.target_positions):
                    # Calculate distance to target
                    dx = self.target_positions[i][0] - self.smooth_positions[i][0]
                    dy = self.target_positions[i][1] - self.smooth_positions[i][1]
                    distance = (dx * dx + dy * dy) ** 0.5
                    
                    if distance > 0.1:  # If not at target
                        all_at_target = False
                        # Move towards target
                        move_distance = move_speed * dt / 1000.0
                        if move_distance >= distance:
                            # Reached target
                            self.smooth_positions[i] = self.target_positions[i]
                        else:
                            # Interpolate towards target
                            ratio = move_distance / distance
                            new_x = self.smooth_positions[i][0] + dx * ratio
                            new_y = self.smooth_positions[i][1] + dy * ratio
                            self.smooth_positions[i] = (new_x, new_y)
            
            # If all segments reached their targets, stop moving
            if all_at_target:
                self.moving = False
    
    def change_direction(self, new_direction):
        # Prevent moving in opposite direction
        if (self.direction[0] * -1, self.direction[1] * -1) != new_direction:
            self.direction = new_direction
    
    def eat_food(self):
        self.grow = True

class Food:
    def __init__(self):
        self.position = self.generate_position()
        self.type = random.choice(['dumpling', 'special_dumpling'])
        
    def generate_position(self):
        return (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
    
    def respawn(self, snake_body, obstacles):
        while True:
            self.position = self.generate_position()
            if self.position not in snake_body and self.position not in obstacles:
                break
        self.type = random.choice(['dumpling', 'special_dumpling'])

class Obstacle:
    def __init__(self):
        self.position = self.generate_position()
        self.type = random.choice(['robux', 'credit_card'])
        
    def generate_position(self):
        return (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
    
    def respawn(self, snake_body, food_position, other_obstacles):
        while True:
            self.position = self.generate_position()
            if (self.position not in snake_body and 
                self.position != food_position and 
                self.position not in other_obstacles):
                break
        self.type = random.choice(['robux', 'credit_card'])


class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Bijo Snake Game - Collect Dumplings!")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 48)
        self.big_font = pygame.font.Font(None, 96)
        self.small_font = pygame.font.Font(None, 32)
        
        # Movement timing
        self.move_timer = 0
        self.move_delay = 150  # milliseconds between moves
        
        # Load images
        self.load_images()
        
        self.reset_game()
    
    def load_images(self):
        """Load Bijo character images and dumpling image"""
        try:
            # Try to load the Bijo images
            self.bijo_forward = pygame.image.load('bijo_forward.png')
            self.bijo_left = pygame.image.load('bijo_left.png')
            self.bijo_right = pygame.image.load('bijo_right.png')
            
            # Scale images to grid size
            self.bijo_forward = pygame.transform.scale(self.bijo_forward, (GRID_SIZE, GRID_SIZE))
            self.bijo_left = pygame.transform.scale(self.bijo_left, (GRID_SIZE, GRID_SIZE))
            self.bijo_right = pygame.transform.scale(self.bijo_right, (GRID_SIZE, GRID_SIZE))
            
            self.images_loaded = True
        except pygame.error:
            print("Warning: Could not load Bijo images. Using colored rectangles instead.")
            self.images_loaded = False
        
        try:
            # Load dumpling image
            self.dumpling_image = pygame.image.load('image.png')
            self.dumpling_image = pygame.transform.scale(self.dumpling_image, (GRID_SIZE, GRID_SIZE))
            self.dumpling_loaded = True
        except pygame.error:
            print("Warning: Could not load dumpling image. Using colored circles instead.")
            self.dumpling_loaded = False
        
        try:
            # Load obstacle images
            self.robux_image = pygame.image.load('robux.png')
            self.robux_image = pygame.transform.scale(self.robux_image, (GRID_SIZE, GRID_SIZE))
            self.credit_card_image = pygame.image.load('creditcard.png')
            self.credit_card_image = pygame.transform.scale(self.credit_card_image, (GRID_SIZE, GRID_SIZE))
            self.obstacles_loaded = True
        except pygame.error:
            print("Warning: Could not load obstacle images. Using colored rectangles instead.")
            self.obstacles_loaded = False
        
        # Load background image
        try:
            self.background_image = pygame.image.load('background.png')
            self.background_image = pygame.transform.scale(self.background_image, (WINDOW_WIDTH, WINDOW_HEIGHT))
            self.background_loaded = True
        except:
            self.background_loaded = False
        
        
    
    def reset_game(self):
        self.snake = Snake()
        self.food = Food()
        self.obstacles = []
        self.score = 0
        self.game_over = False
        self.paused = False
        self.obstacle_timer = 0
        self.obstacle_spawn_delay = 2000  # Spawn obstacle every 2 seconds
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            elif event.type == pygame.KEYDOWN:
                if self.game_over:
                    if event.key == pygame.K_SPACE:
                        self.reset_game()
                elif event.key == pygame.K_p:
                    self.paused = not self.paused
                elif not self.paused:
                    if event.key == pygame.K_UP:
                        self.snake.change_direction(UP)
                    elif event.key == pygame.K_DOWN:
                        self.snake.change_direction(DOWN)
                    elif event.key == pygame.K_LEFT:
                        self.snake.change_direction(LEFT)
                    elif event.key == pygame.K_RIGHT:
                        self.snake.change_direction(RIGHT)
        return True
    
    def update(self, dt):
        if not self.game_over and not self.paused:
            # Update smooth movement every frame
            self.snake.update_smooth(dt)
            
            # Update obstacle timer
            self.obstacle_timer += dt
            if self.obstacle_timer >= self.obstacle_spawn_delay:
                self.obstacle_timer = 0
                # Spawn new obstacle frequently
                if random.random() < 0.8:  # 80% chance to spawn obstacle
                    obstacle = Obstacle()
                    obstacle.respawn(self.snake.body, self.food.position, [obs.position for obs in self.obstacles])
                    self.obstacles.append(obstacle)
            
            # Update movement timer
            self.move_timer += dt
            
            # Move snake only when timer reaches delay
            if self.move_timer >= self.move_delay:
                self.move_timer = 0
                
                if not self.snake.move():
                    self.game_over = True
                    return
                
                # Check obstacle collision
                for obstacle in self.obstacles:
                    if self.snake.body[0] == obstacle.position:
                        self.game_over = True
                        return
                
                # Check food collision
                if self.snake.body[0] == self.food.position:
                    self.snake.eat_food()
                    self.score += 10 if self.food.type == 'dumpling' else 50
                    obstacle_positions = [obs.position for obs in self.obstacles]
                    self.food.respawn(self.snake.body, obstacle_positions)
    
    def draw_bijo_head(self, x, y, direction):
        """Draw Bijo character head based on direction"""
        if not self.images_loaded:
            # Fallback: draw colored rectangle
            color = LIGHT_BROWN if direction == UP or direction == DOWN else BROWN
            pygame.draw.rect(self.screen, color, (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE))
            pygame.draw.rect(self.screen, DARK_BROWN, (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE), 2)
            return
        
        # Use appropriate Bijo image based on direction
        if direction == LEFT:
            self.screen.blit(self.bijo_left, (x * GRID_SIZE, y * GRID_SIZE))
        elif direction == RIGHT:
            self.screen.blit(self.bijo_right, (x * GRID_SIZE, y * GRID_SIZE))
        else:
            self.screen.blit(self.bijo_forward, (x * GRID_SIZE, y * GRID_SIZE))
    
    def draw_bijo_head_smooth(self, x, y, direction):
        """Draw Bijo character head at smooth pixel position"""
        if not self.images_loaded:
            # Fallback: draw colored rectangle
            color = LIGHT_BROWN if direction == UP or direction == DOWN else BROWN
            pygame.draw.rect(self.screen, color, (x, y, GRID_SIZE, GRID_SIZE))
            pygame.draw.rect(self.screen, DARK_BROWN, (x, y, GRID_SIZE, GRID_SIZE), 2)
            return
        
        # Use appropriate Bijo image based on direction
        if direction == LEFT:
            self.screen.blit(self.bijo_left, (x, y))
        elif direction == RIGHT:
            self.screen.blit(self.bijo_right, (x, y))
        else:
            self.screen.blit(self.bijo_forward, (x, y))
    
    def draw_dumpling(self, x, y, food_type):
        """Draw dumpling food"""
        if self.dumpling_loaded:
            # Use the dumpling image
            if food_type == 'special_dumpling':
                # Add golden tint for special dumplings
                tinted_image = self.dumpling_image.copy()
                # Create a golden overlay
                overlay = pygame.Surface((GRID_SIZE, GRID_SIZE))
                overlay.fill(YELLOW)
                overlay.set_alpha(100)
                tinted_image.blit(overlay, (0, 0))
                self.screen.blit(tinted_image, (x * GRID_SIZE, y * GRID_SIZE))
            else:
                # Regular dumpling
                self.screen.blit(self.dumpling_image, (x * GRID_SIZE, y * GRID_SIZE))
        else:
            # Fallback: draw colored circles
            center_x = x * GRID_SIZE + GRID_SIZE // 2
            center_y = y * GRID_SIZE + GRID_SIZE // 2
            radius = GRID_SIZE // 3
            
            if food_type == 'special_dumpling':
                # Special golden dumpling
                pygame.draw.circle(self.screen, YELLOW, (center_x, center_y), radius)
                pygame.draw.circle(self.screen, ORANGE, (center_x, center_y), radius - 2)
                # Add sparkle effect
                for i in range(4):
                    sparkle_x = center_x + (radius - 2) * (1 if i % 2 == 0 else -1)
                    sparkle_y = center_y + (radius - 2) * (1 if i < 2 else -1)
                    pygame.draw.circle(self.screen, WHITE, (int(sparkle_x), int(sparkle_y)), 2)
            else:
                # Regular dumpling
                pygame.draw.circle(self.screen, WHITE, (center_x, center_y), radius)
                pygame.draw.circle(self.screen, (240, 240, 240), (center_x, center_y), radius - 2)
                # Dumpling pleats
                for i in range(3):
                    pleat_y = center_y - radius + 2 + i * 2
                    pygame.draw.line(self.screen, (200, 200, 200), 
                                   (center_x - radius + 2, pleat_y), 
                                   (center_x + radius - 2, pleat_y), 1)
    
    def draw_obstacle(self, x, y, obstacle_type):
        """Draw obstacle (robux or credit card)"""
        if self.obstacles_loaded:
            if obstacle_type == 'robux':
                self.screen.blit(self.robux_image, (x * GRID_SIZE, y * GRID_SIZE))
            else:  # credit_card
                self.screen.blit(self.credit_card_image, (x * GRID_SIZE, y * GRID_SIZE))
        else:
            # Fallback: draw colored rectangles
            if obstacle_type == 'robux':
                color = (255, 0, 0)  # Red for robux
            else:  # credit_card
                color = (0, 0, 255)  # Blue for credit card
            
            pygame.draw.rect(self.screen, color, 
                           (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE))
            pygame.draw.rect(self.screen, WHITE, 
                           (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE), 2)
    
    
    def draw_grid(self):
        """Draw the game grid"""
        # Draw vertical lines
        for x in range(GRID_WIDTH + 1):
            start_pos = (x * GRID_SIZE, 0)
            end_pos = (x * GRID_SIZE, GRID_HEIGHT * GRID_SIZE)
            pygame.draw.line(self.screen, (50, 50, 50), start_pos, end_pos, 1)
        
        # Draw horizontal lines
        for y in range(GRID_HEIGHT + 1):
            start_pos = (0, y * GRID_SIZE)
            end_pos = (GRID_WIDTH * GRID_SIZE, y * GRID_SIZE)
            pygame.draw.line(self.screen, (50, 50, 50), start_pos, end_pos, 1)
    
    def draw_border(self):
        """Draw the game border"""
        # Calculate border rectangle for the actual grid area
        border_rect = pygame.Rect(0, 0, GRID_WIDTH * GRID_SIZE, GRID_HEIGHT * GRID_SIZE)
        pygame.draw.rect(self.screen, WHITE, border_rect, 3)
    
    def draw(self):
        # Clear the screen completely first
        self.screen.fill(BLACK)
        
        # Draw background
        if self.background_loaded:
            self.screen.blit(self.background_image, (0, 0))
        
        # Draw grid and border
        self.draw_grid()
        self.draw_border()
        
        if not self.game_over:
            # Draw snake with smooth positions for all segments
            for i in range(len(self.snake.body)):
                if i < len(self.snake.smooth_positions):
                    smooth_x = self.snake.smooth_positions[i][0] * GRID_SIZE
                    smooth_y = self.snake.smooth_positions[i][1] * GRID_SIZE
                    
                    if i == 0:  # Head
                        self.draw_bijo_head_smooth(smooth_x, smooth_y, self.snake.direction)
                    else:  # Body - use Bijo's face for all segments
                        self.draw_bijo_head_smooth(smooth_x, smooth_y, self.snake.direction)
            
            # Draw food
            self.draw_dumpling(self.food.position[0], self.food.position[1], self.food.type)
            
            # Draw obstacles
            for obstacle in self.obstacles:
                self.draw_obstacle(obstacle.position[0], obstacle.position[1], obstacle.type)
        
        # Draw UI
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        if self.paused:
            pause_text = self.big_font.render("PAUSED", True, YELLOW)
            text_rect = pause_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
            self.screen.blit(pause_text, text_rect)
            
            resume_text = self.small_font.render("Press P to resume", True, WHITE)
            resume_rect = resume_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 50))
            self.screen.blit(resume_text, resume_rect)
        
        if self.game_over:
            game_over_text = self.big_font.render("GAME OVER", True, RED)
            text_rect = game_over_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 - 50))
            self.screen.blit(game_over_text, text_rect)
            
            final_score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
            score_rect = final_score_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
            self.screen.blit(final_score_text, score_rect)
            
            restart_text = self.small_font.render("Press SPACE to restart", True, WHITE)
            restart_rect = restart_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 50))
            self.screen.blit(restart_text, restart_rect)
        
        # Draw instructions
        if not self.game_over and not self.paused:
            instructions = [
                "Use arrow keys to move",
                "Press P to pause",
                "Collect dumplings to grow!"
            ]
            for i, instruction in enumerate(instructions):
                inst_text = self.small_font.render(instruction, True, (200, 200, 200))
                self.screen.blit(inst_text, (10, WINDOW_HEIGHT - 80 + i * 20))
        
        pygame.display.flip()
        pygame.display.update()
    
    def run(self):
        running = True
        while running:
            dt = self.clock.tick(60)  # 60 FPS for smooth movement
            running = self.handle_events()
            self.update(dt)
            self.draw()
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()
