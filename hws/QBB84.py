import numpy as np
import random
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ------------------------
# Qubit 클래스 (수제 구현)
# ------------------------
class Qubit:
    def __init__(self, alpha: complex = 1.0+0j, beta: complex = 0.0 +0j) -> None:
        self._amplitudes = np.array([alpha, beta], dtype=complex)
        self._normalise()

    def _normalise(self) -> None:
        norm = np.sqrt(np.abs(self._amplitudes[0])**2 + np.abs(self._amplitudes[1])**2)
        if norm == 0:
            raise ValueError("Cannot normalize zero state vector")
        self._amplitudes /= norm

    def apply_unitary(self, matrix: np.ndarray) -> None:
        if matrix.shape != (2, 2):
            raise ValueError("Matrix must be 2x2, got {matrix.shape}")
        if not np.allclose(np.eye(2), matrix @ matrix.conjugate().T):
            raise ValueError("Matrix is not unitary")
        self._amplitudes = matrix @ self._amplitudes

    def measure(self) -> int:
        prob_0 = np.abs(self._amplitudes[0]) ** 2
        outcome = random.choices([0, 1], weights=[prob_0, 1 - prob_0], k=1)[0]
        self._amplitudes = np.array([1.0, 0.0]) if outcome == 0 else np.array([0.0, 1.0])
        return outcome

# ------------------------
# BB84 상태 및 측정 함수
# ------------------------
def get_bb84_state(label: str) -> Qubit:
    if label == "0":
        return Qubit(1+0j, 0+0j)
    elif label == "1":
        return Qubit(0+0j, 1+0j)
    elif label == "+":
        return Qubit(1/np.sqrt(2), 1/np.sqrt(2))
    elif label == "-":
        return Qubit(1/np.sqrt(2), -1/np.sqrt(2))
    else:
        raise ValueError("Invalid label")

def measure_in_basis(qubit: Qubit, basis: str) -> int:
    if basis == "Z":
        return qubit.measure()
    elif basis == "X":
        H = (1/np.sqrt(2)) * np.array([[1, 1], [1, -1]])
        qubit.apply_unitary(H)
        return qubit.measure()
    else:
        raise ValueError("Invalid basis")

def intercept_and_resend(qubit: Qubit) -> Qubit:
    eve_basis = random.choice(["Z", "X"])
    result = measure_in_basis(qubit, eve_basis)
    if eve_basis == "Z":
        return Qubit(1+0j, 0+0j) if result == 0 else Qubit(0+0j, 1+0j)
    else:
        return Qubit(1/np.sqrt(2), 1/np.sqrt(2)) if result == 0 else Qubit(1/np.sqrt(2), -1/np.sqrt(2))

# ------------------------
# 데이터셋 생성 및 분류 실험
# ------------------------
def generate_dataset(n_samples: int = 1000):
    X, y = [], []
    labels = ["0", "1", "+", "-"]
    for _ in range(n_samples):
        label = random.choice(labels)
        original = get_bb84_state(label)
        qubit = get_bb84_state(label)

        is_attack = random.random() < 0.5
        y.append(1 if is_attack else 0)

        if is_attack:
            qubit = intercept_and_resend(qubit)

        z_result = measure_in_basis(qubit, "Z")
        x_result = measure_in_basis(original, "X")
        X.append([z_result, x_result])
    return np.array(X), np.array(y)

# ------------------------
# SVM 분류기 실행
# ------------------------
X, y = generate_dataset(1000)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
clf = SVC(kernel="linear")
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))
