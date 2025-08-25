'use client';

import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useAuth } from './useAuth';

export const useRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [collections, setCollections] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved requests
  const fetchRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.API_REQUESTS,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );
      setRequests(response.documents);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch collections
  const fetchCollections = async () => {
    if (!user) return;
    
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.API_COLLECTIONS,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );
      setCollections(response.documents);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  // Fetch history
  const fetchHistory = async () => {
    if (!user) return;
    
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.API_HISTORY,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(50) // Limit to recent 50 requests
        ]
      );
      setHistory(response.documents);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  // Save a request (create new or update existing)
  const saveRequest = async (requestData) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Check if a request with the same method and URL already exists
      const existingRequest = requests.find(
        req => req.method === requestData.method && req.url === requestData.url
      );

      if (existingRequest) {
        // Update existing request
        const document = await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.API_REQUESTS,
          existingRequest.$id,
          {
            name: requestData.name || `${requestData.method} ${requestData.url}`,
            method: requestData.method,
            url: requestData.url,
            headers: JSON.stringify(requestData.headers || {}),
            body: requestData.body || '',
            updatedAt: new Date().toISOString()
          }
        );
        
        setRequests(prev => prev.map(req => 
          req.$id === existingRequest.$id ? document : req
        ));
        // Force immediate refresh for real-time updates
        setTimeout(() => {
          fetchRequests();
          fetchCollections();
        }, 100);
        return { success: true, data: document, updated: true };
      } else {
        // Create new request
        const document = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.API_REQUESTS,
          ID.unique(),
          {
            userId: user.$id,
            name: requestData.name || `${requestData.method} ${requestData.url}`,
            method: requestData.method,
            url: requestData.url,
            headers: JSON.stringify(requestData.headers || {}),
            body: requestData.body || '',
            createdAt: new Date().toISOString()
          }
        );
        
        setRequests(prev => [document, ...prev]);
        // Force immediate refresh for real-time updates
        setTimeout(() => {
          fetchRequests();
          fetchCollections();
        }, 100);
        return { success: true, data: document, updated: false };
      }
    } catch (error) {
      console.error('Failed to save request:', error);
      return { success: false, error: error.message };
    }
  };

  // Save request execution to history
  const saveToHistory = async (requestData, response) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.API_HISTORY,
        ID.unique(),
        {
          userId: user.$id,
          method: requestData.method,
          url: requestData.url,
          status: response.status,
          responseTime: response.responseTime || 0,
          response: JSON.stringify(response.data || {}),
          createdAt: new Date().toISOString()
        }
      );
      
      setHistory(prev => [document, ...prev.slice(0, 49)]); // Keep only 50 items
      return { success: true, data: document };
    } catch (error) {
      console.error('Failed to save history:', error);
      return { success: false, error: error.message };
    }
  };

  // Create a new collection
  const createCollection = async (collectionName) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.API_COLLECTIONS,
        ID.unique(),
        {
          userId: user.$id,
          collectionName,
          requests: [], // Store as actual array
          createdAt: new Date().toISOString()
        }
      );
      
      setCollections(prev => [document, ...prev]);
      // Force immediate refresh for real-time updates
      setTimeout(() => {
        fetchCollections();
      }, 100);
      return { success: true, data: document };
    } catch (error) {
      console.error('Failed to create collection:', error);
      return { success: false, error: error.message };
    }
  };

  // Remove request from collection
  const removeRequestFromCollection = async (collectionId, requestId) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Find the collection
      const collection = collections.find(c => c.$id === collectionId);
      if (!collection) return { success: false, error: 'Collection not found' };

      // Get existing requests
      let existingRequests = collection.requests || [];
      
      // Handle legacy data that might be stored as JSON string
      if (typeof existingRequests === 'string') {
        try {
          existingRequests = JSON.parse(existingRequests);
        } catch {
          existingRequests = [];
        }
      }

      // Remove the request
      existingRequests = existingRequests.filter(id => id !== requestId);

      // Update the collection
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.API_COLLECTIONS,
        collectionId,
        {
          requests: existingRequests
        }
      );
      
      setCollections(prev => prev.map(c => 
        c.$id === collectionId ? document : c
      ));
      return { success: true, data: document };
    } catch (error) {
      console.error('Failed to remove request from collection:', error);
      return { success: false, error: error.message };
    }
  };

  // Add request to collection
  const addRequestToCollection = async (collectionId, requestId) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Find the collection
      const collection = collections.find(c => c.$id === collectionId);
      if (!collection) return { success: false, error: 'Collection not found' };

      // Get existing requests (should be an array)
      let existingRequests = collection.requests || [];
      
      // Handle legacy data that might be stored as JSON string
      if (typeof existingRequests === 'string') {
        try {
          existingRequests = JSON.parse(existingRequests);
        } catch {
          existingRequests = [];
        }
      }

      // Add new request if not already present
      if (!existingRequests.includes(requestId)) {
        existingRequests.push(requestId);
      }

      // Update the collection with actual array
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.API_COLLECTIONS,
        collectionId,
        {
          requests: existingRequests
        }
      );
      
      setCollections(prev => prev.map(c => 
        c.$id === collectionId ? document : c
      ));
      // Force immediate refresh for real-time updates
      setTimeout(() => {
        fetchRequests();
        fetchCollections();
      }, 100);
      return { success: true, data: document };
    } catch (error) {
      console.error('Failed to add request to collection:', error);
      return { success: false, error: error.message };
    }
  };

  // Save request and optionally add to collection
  const saveRequestToCollection = async (requestData, collectionId = null) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // First save the request
      const saveResult = await saveRequest(requestData);
      if (!saveResult.success) return saveResult;

      const requestId = saveResult.data.$id;

      // If request was updated (not new), find its current collection and remove it
      if (saveResult.updated && requestData.requestId) {
        // Find which collection currently contains this request
        const currentCollection = collections.find(collection => {
          let requestIds = collection.requests || [];
          if (typeof requestIds === 'string') {
            try {
              requestIds = JSON.parse(requestIds);
            } catch {
              requestIds = [];
            }
          }
          return Array.isArray(requestIds) && requestIds.includes(requestData.requestId);
        });

        // Remove from current collection if it exists and is different from new collection
        if (currentCollection && currentCollection.$id !== collectionId) {
          await removeRequestFromCollection(currentCollection.$id, requestData.requestId);
        }
      }

      // If collection ID provided, add to collection
      if (collectionId) {
        await addRequestToCollection(collectionId, requestId);
      }

      return saveResult;
    } catch (error) {
      console.error('Failed to save request to collection:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete a request
  const deleteRequest = async (requestId) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.API_REQUESTS,
        requestId
      );
      
      setRequests(prev => prev.filter(req => req.$id !== requestId));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete request:', error);
      return { success: false, error: error.message };
    }
  };

  // Update a request
  const updateRequest = async (requestId, requestData) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.API_REQUESTS,
        requestId,
        {
          name: requestData.name || `${requestData.method} ${requestData.url}`,
          method: requestData.method,
          url: requestData.url,
          headers: JSON.stringify(requestData.headers || {}),
          body: requestData.body || ''
        }
      );
      
      setRequests(prev => prev.map(req => 
        req.$id === requestId ? document : req
      ));
      return { success: true, data: document };
    } catch (error) {
      console.error('Failed to update request:', error);
      return { success: false, error: error.message };
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchCollections();
      fetchHistory();
      
      // Set up periodic refresh to keep data in sync
      const interval = setInterval(() => {
        fetchRequests();
        fetchCollections();
        fetchHistory();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    } else {
      setRequests([]);
      setCollections([]);
      setHistory([]);
    }
  }, [user]);

  return {
    requests,
    collections,
    history,
    loading,
    saveRequest,
    saveToHistory,
    createCollection,
    addRequestToCollection,
    removeRequestFromCollection,
    saveRequestToCollection,
    deleteRequest,
    updateRequest,
    fetchRequests,
    fetchCollections,
    fetchHistory,
    findRequestCollection: (requestId) => {
      return collections.find(collection => {
        let requestIds = collection.requests || [];
        if (typeof requestIds === 'string') {
          try {
            requestIds = JSON.parse(requestIds);
          } catch {
            requestIds = [];
          }
        }
        return Array.isArray(requestIds) && requestIds.includes(requestId);
      });
    }
  };
};