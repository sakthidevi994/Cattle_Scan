# SmartCattle AI

Cattle Breed & Weight Identification System.
Features:
- Identifies cattle breed (Gir / Kankrej) using EfficientNet-B0.
- Estimates weight range based on breed.
- Modern, responsive React UI.

## Project Structure

- **frontend**: React + Vite
- **backend**: Python Flask + PyTorch

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Ensure you have Python installed)*

3. Run the Flask server:
   ```bash
   python app.py
   ```
   The server will start at `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal in the root folder (`SmartCattle AI`).

2. Install dependencies (if not done):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser (usually `http://localhost:5173`).

## Usage

1. Drag & drop a cattle image.
2. Ensure "Identify Breed" is selected.
3. Click "Analyze Cattle".
4. View the results!
