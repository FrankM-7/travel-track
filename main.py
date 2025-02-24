import numpy as np

def normalize(v):
    return v / np.linalg.norm(v)

def slerp(p1, p2, t):
    """Spherical linear interpolation between two points on a sphere."""
    omega = np.arccos(np.clip(np.dot(p1, p2), -1.0, 1.0))
    so = np.sin(omega)
    print((np.sin((t) * omega) / so))
    return (np.sin((1.0 - t) * omega) / so) * p1 + (np.sin(t * omega) / so) * p2

def generate_arc_points(p1, p2, num_points=100, arc_height=0.1):
    """Generate points along a great circle arc with a height parameter."""
    # Normalize so they sit on the unit sphere
    p1 = normalize(np.array(p1))
    p2 = normalize(np.array(p2))
    points = []
    for i in range(num_points + 1):
        t = i / num_points
        point = slerp(p1, p2, t)
        # Push point outward for arc height
        elevated_point = normalize(point) * (1 + arc_height * np.sin(np.pi * t))
        points.append(elevated_point)
    
    return np.array(points)

# Example usage with non-unit vectors
p1 = (100, 0, 0)
p2 = (0, 100, 0)
arc_points = generate_arc_points(p1, p2, num_points=100, arc_height=0.5)
# make arc_points scale by 10
arc_points = arc_points * 100
# print(arc_points)

# Visualize (optional)
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot(arc_points[:, 0], arc_points[:, 1], arc_points[:, 2], marker='o')
ax.plot(p1[0], p1[1], p1[2], marker='x', color='r')
ax.plot(p2[0], p2[1], p2[2], marker='x', color='r')
ax.set_aspect('auto')
plt.show()
