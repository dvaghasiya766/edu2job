from flask import Flask, request, jsonify
import numpy as np
import pandas as pd

from src.edu2job_random_forest_classifier import main

app = Flask(__name__)

model, degree_enc, spec_enc, job_enc, feature_columns = main()


@app.route("/")
def home():
    return jsonify({"status": "Active"})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        # Build input row
        row = {
            "Degree": degree_enc.transform([data["Degree"]])[0],
            "Specialization": spec_enc.transform([data["Specialization"]])[0],
            "YearOfPassing": int(data["YOP"]),
            "CGPA": float(data["CGPA"]),
            "Certifications": int(data["Certifications"])
        }

        input_df = pd.DataFrame([row])[feature_columns]

        # Predict probabilities
        probs = model.predict_proba(input_df)[0]

        # Get top 3 indices
        top_3_idx = np.argsort(probs)[-3:][::-1]

        results = []
        for idx in top_3_idx:
            job_role = job_enc.inverse_transform([idx])[0]
            confidence = round(float(probs[idx]) * 100, 2)

            results.append({
                "job_role": job_role,
                "confidence": confidence
            })

        return jsonify({"predictions": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
