import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


def get_data():
    return pd.read_csv("./data/student_job_dataset.csv")

def main():
    df = get_data()

    # Encoders
    degree_enc = LabelEncoder()
    spec_enc = LabelEncoder()
    job_enc = LabelEncoder()

    df["Degree"] = degree_enc.fit_transform(df["Degree"])
    df["Specialization"] = spec_enc.fit_transform(df["Specialization"])
    df["JobRole"] = job_enc.fit_transform(df["JobRole"])

    X = df.drop("JobRole", axis=1)
    y = df["JobRole"]

    # ✅ SAVE FEATURE ORDER
    feature_columns = X.columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    print("Accuracy:", accuracy_score(y_test, model.predict(X_test)))

    # ✅ RETURN 5 VALUES
    return model, degree_enc, spec_enc, job_enc, feature_columns